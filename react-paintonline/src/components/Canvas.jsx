
import { observer } from 'mobx-react-lite'; // импортриуем observer,чтобы обернуть им наш компонент,чтобы mobx мог отслеживать в этом компоненте состояния из классов,которые мы сделали для mobx и перерендеривать компонент
import { useEffect, useRef } from 'react';
import canvasState from '../store/canvasState';

import toolState from '../store/toolState';
import Brush from '../tools/Brush';

import { useParams } from 'react-router-dom';
import Rect from '../tools/Rect';

import axios from 'axios'; // импортируем axios,чтобы работать с запросами на сервер,импортируем вручную,так как автоматически не импортируется

// оборачиваем наш компонент в observer(),чтобы mobx мог отслеживать в этом компоненте изменение состояния в классах,которые мы сделали для mobx и перерендеривать компонент
const Canvas = observer(() => {

    const canvasRef = useRef(); // создаем ссылку для canvas с помощью useRef()

    const params = useParams(); // получаем параметры url текущей страницы с помощью useParams(),в данном случае там будет динамический id

    // при запуске сайта(при рендере этого компонента) отработает код в этом useEffect,так как массив зависимостей у этого useEffect пустой
    useEffect(() => {

        canvasState.setCanvas(canvasRef.current); // изменяем состояние canvas у canvasState(типа редьюсер(для mobx просто создаются классы) для canvas,которое мы сделали у mobx) на значение canvasRef.current,то есть html элемент canvas

        drawServerImgCanvas();


    }, [])

    const drawServerImgCanvas = async () => {

        canvasState.setCanvas(canvasRef.current); // указываем поле canvas у состояния у mobx как текущий canvasRef.current(канвас)

        const response = await axios.get(`http://localhost:5000/image?id=${params.id}`); // делаем get запрос на получение картинки для канваса,указываем query параметр id со значением id текущей сессии,текущего подключения к вебсокет серверу(params.id)

        const img = new Image(); // создаем объект на основе класса Image

        img.src = response.data; // в атрибут(поле) src передаем изображение,которое взяли из запроса на сервер(response.data)

        // реализовываем слушатель события onload,который сработает,когда изображение установилось,эта операция не мнгновенная,поэтому эта функция асинхронная
        img.onload = () => {

            canvasState.canvas.getContext('2d').clearRect(0, 0, canvasRef.current.width, canvasRef.current.height); // очищаем канвас полностью от тех фигур с помощью clearRect(параметрами принимает координаты по x,y,ширину и высоту канваса),которые нарисовали,то есть когда водим мышкой с зажатой левой клавишей мыши,рисуется куча квадратов,их и очищаем,чтобы видеть только текущий объект(прямоугольник)

            // так как вы очищаем весь канвас с помощью clearRect(),нам нужно вернуть старые рисунки,которые были до этого,для этого и сохраняли изображение канваса в переменную this(типа этого класса).saved, первым параметром drawImage() принимает изображение(img в данном случае,то есть картинку которую помещали в переменную this.saved),вторым параметром координату начальной точки x на канвасе,третьим параметром координату начальной точки y на канвасе,4 и 5 параметром принимает ширину и высоту канваса
            canvasState.canvas.getContext('2d').drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);


        }

    }

    // код в этом useEffect будет отрабатывать при рендеринге этого компонента(в данном случае при запуске страницы) и при изменении поля username у canvasState(так как его указали в массиве зависимостей этого useEffect)
    useEffect(() => {

        // если username у canvasState true(то есть в этом поле есть какое-то значение)
        if (canvasState.username) {

            const socket = new WebSocket('ws://localhost:5000'); // создаем объект на основе класса WebSocket(),то есть создаем объект вебсокета,параметром в этот конструктор передаем url до нашего ws(вебсокет) сервера,но вместо обычного протокола http,указываем протокол ws(это для вебсокетов)

            canvasState.setSocket(socket); // изменяем поле socket у canvasState(состояние у mobx) на этот наш socket,который создали чуть выше в коде

            canvasState.setSessionId(params.id); // изменяем поле sessionid у canvasState(состояние у mobx) на params.id(динамический параметр url этой страницы,который является id вебсокета)

            toolState.setTool(new Brush(canvasRef.current, socket, params.id)); // присваем инструмент как кисть(в данном случае), то есть изменяем состояние tool у toolState(типа редьюсер(для mobx просто создаются классы) для инструмента,которое мы сделали у mobx),в setTool() передаем новый объект,созданный на основе нашего класса Brush и в его конструктор передаем canvasRef.current(ссылку на канвас), socket(вебсокет) и params.id(типа id сессии,то есть текущего подключения к этому вебсокету(вебсокет серверу))

            // отслеживаем открытие(подключение к нему) этого вебсокета,используем слушатель события onopen,указываем ему функцию,которая будет отработана,при этом событии(в данном случае при открытии вебсокета)
            socket.onopen = () => {

                console.log('Подключение установлено');

                // отправляем сообщение на сервер с помощью send() у этого socket,в него передаем объект,обернутый в JSON.stringify(),он преобразовывает объекты в строковый формат,делаем это,так как обмениваться сообщениями через вебсокеты можно только в строковом формате,потом на бэкэнде будем парсить этот объект в виде строки в обычный javascript объект с помощью JSON.parse()
                socket.send(JSON.stringify({

                    id: params.id, // указываем поле id как динамический параметр id у params(параметров url текущей страницы)

                    username: canvasState.username, // указываем поле username со значением username у canvasState(состояния у mobx)

                    method: "connection" // указываем это поле,чтобы потом на бэкэнде в зависимости от значения в этом поле,отправлять разные сообщения на клиент(фронтенд)

                }))

            }

            // обрабатываем слушатель сообщений(onmessage),то есть когда придет сообщение от вебсокет сервера,параметром функция в onmessage принимает event(событие)
            socket.onmessage = (event) => {

                let msg = JSON.parse(event.data); // парсим этот объект сообщения(который пришел от сервера,в поле data у event(событие,параметр этой функции) находится сообщение,которое пришло от вебсокет сервера) в виде строки в обычный javascript объект с помощью JSON.parse() и помещаем его в переменную msg

                // console.log('С сервера пришло сообщение', msg); // выводим в логи сообщение

                // используем тут switch case,чтобы в зависимости от значения в поле method у msg(сообщения),делать разную логику,то есть проверяем поле method у msg на разные значения 
                switch (msg.method) {

                    // если поле method у msg равно значению "connection"
                    case "connection":

                        console.log(`Пользователь ${msg.username} присоединился`); // выводим в логи сообщение

                        break // указываем break,чтобы остановить код этого case

                    // если поле method у msg равно значению "draw"
                    case "draw":

                        drawHandler(msg) // вызываем нашу функцию drawHandler и параметрами передаем msg(сообщение,которое получили от сервера)

                        break // указываем break,чтобы остановить код этого case

                }

            }

        }


    }, [canvasState.username])


    const drawHandler = (msg) => {

        const figure = msg.figure; // берем поле figure у msg(объекта сообщения) и помещаем его в переменную figure,это чтобы взять объект фигуры,которую будем рисовать

        const ctx = canvasRef.current.getContext('2d'); // берем контекст из этого канваса(canvasRef.current) с помощью getContext('2d'),указываем '2d' в getContext(),чтобы указать,что этот канвас взаимодействует с 2d объектами,так как канвас может взаимодействовать и с 3d объектами) и помещаем его в переменную ctx

        // используем тут switch case,чтобы в зависимости от значения в поле type у figure,делать разную логику(то есть рисовать тем или иным инструментом),то есть проверяем поле type у figure на разные значения 
        switch (figure.type) {

            // если поле type у figure равно значению "brush"
            case "brush":

                Brush.draw(ctx, figure.x, figure.y); // используем функцию draw у нашего класса Brush,туда передаем ctx(контекст канваса), figure.x(поле(координату) x у объекта figure) и figure.y(поле(координату) y у объекта figure)

                break // указываем break,чтобы остановить код этого case

            // если поле type у figure равно значению "rect"
            case "rect":

                Rect.staticDraw(ctx, figure.x, figure.y, figure.width, figure.height, figure.color); // используем функцию staticDraw у нашего класса Rect,туда передаем ctx(контекст канваса), figure.x(поле(координату) x у объекта figure), figure.y(поле(координату) y у объекта figure), figure.width и figure.height(ширина и высота для прямоугольника), figure.color(цвет фигуры)

                break // указываем break,чтобы остановить код этого case

            // если поле type у figure равно значению "finish"
            case "finish":

                ctx.beginPath() // используем функцию beginPath у ctx(контекста канваса),то есть указываем,что начинаем новый путь рисования,то есть новую фигуру(это чтобы линии не соединялись и рисовались отдельно и правильно)

                break // указываем break,чтобы остановить код этого case


        }

    }

    const mouseDownHandler = async () => {

        canvasState.pushToUndo(canvasRef.current.toDataURL()); // добавляем в массив undoList у состояния canvasState с помощью нашей функции pushToUndo() изображение с канваса с помощью toDataURL() у current у canvasRef(это чтобы потом возвращать действия назад и вперед)

        const response = await axios.post(`http://localhost:5000/image?id=${params.id}`, { img: canvasRef.current.toDataURL() }); // делаем post запрос на сервер,первым параметром указываем url,указываем id как query параметр со значением params.id(то есть id текущей сессии,текущего подключения к вебсокет серверу),вторым параметром указываем тело запроса,указываем поле img со значением текущей картинки канваса с помощью canvasRef.current.toDataURL()

        console.log(response.data);

    }


    return (
        <div className="canvas">

            {/* создаем сам canvas(холст,на котором будем рисовать),ширину и высоту canvas нужно указывать именно как параметры здесь у этого html тега,так как в css они будут неправильно считаться,когда будем рисовать,указываем в ref ссылку canvasRef для этого canvas, в onMouseDown(когда пользователь нажал левой кнопкой мыши на этот канвас) указываем(вызываем) нашу функцию mouseDownHandler */}
            <canvas onMouseDown={() => mouseDownHandler()} ref={canvasRef} width={600} height={400} />

        </div>
    )

})

export default Canvas;