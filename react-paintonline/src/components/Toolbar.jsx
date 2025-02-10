import { useEffect } from "react";
import canvasState from "../store/canvasState";
import toolState from "../store/toolState";
import Brush from "../tools/Brush";
import Rect from "../tools/Rect";

const Toolbar = () => {

    // const socket = new WebSocket('ws://localhost:5000'); // создаем объект на основе класса WebSocket(),то есть создаем объект вебсокета,параметром в эттот конструктор передаем url до нашего ws(вебсокет) сервера,но вместо обычного протокола http,указываем протокол ws(это для вебсокетов)

    const changeColor = (e) => {

        toolState.setStrokeColor(e.target.value); // изменяем цвет обводки на e.target.value(значение инпута)

        toolState.setFillColor(e.target.value); // изменяем цвет заполнения обводки на e.target.value(значение инпута)

    }

    // закомментировали этот код,так как он был просто тестовым и почти такой же функционал сделали в файле Canvas.tsx
    // это просто тестовая функция,которая отправляем сообщение на наш ws(вебсокет) сервер
    // const testWs = () => {

    //     // socket.send("Привет,сервер"); // с помощью send() у этого socket отправляем сообщение на сервер,вебсокеты не могут принимать javascript объекты,а могут работать только со строковым форматом данных,поэтому потом нужно будет парсить(JSON.parse()) или преобразовывать из объекта в строку(JSON.stringify()) при обмене сообщениями,если нужно будет работать с объектами

    //     // отправляем сообщение на сервер с помощью send() у этого socket,в него передаем объект,обернутый в JSON.stringify(),он преобразовывает объекты в строковый формат,делаем это,так как обмениваться сообщениями через вебсокеты можно только в строковом формате,потом на бэкэнде будем парсить этот объект в виде строки в обычный javascript объект с помощью JSON.parse()
    //     socket.send(JSON.stringify({

    //         message: "Привет",

    //         method: "message", // указываем это поле,чтобы потом на бэкэнде в зависимости от значения в этом поле,отправлять разные сообщения на клиент(фронтенд)

    //         id: 123,

    //         username: 'Ulbi TV'

    //     }))

    // }

    // // это просто тестовый useEffect,который отработает при рендере этого компонента(то есть в данном случае при запуске сайта),так как этот useEffect с пустым массивом зависимостей,чтобы проверить,установлено ли подключение к нашему вебсокет серверу,эту функцию можно не делать,просто для теста
    // useEffect(() => {

    //     // отслеживаем открытие(подключение к нему) этого вебсокета,используем слушатель события onopen,указываем ему функцию,которая будет отработана,при этом событии(в данном случае при открытии вебсокета)
    //     socket.onopen = () => {

    //         console.log('Подключение установлено');

    //         // отправляем сообщение на сервер с помощью send() у этого socket,в него передаем объект,обернутый в JSON.stringify(),он преобразовывает объекты в строковый формат,делаем это,так как обмениваться сообщениями через вебсокеты можно только в строковом формате,потом на бэкэнде будем парсить этот объект в виде строки в обычный javascript объект с помощью JSON.parse()
    //         socket.send(JSON.stringify({

    //             message: "Привет",

    //             method: "connection",

    //             id: 123,

    //             username: 'Ulbi TV'

    //         }))

    //     }

    //     // обрабатываем слушатель сообщений(onmessage),параметром функция в onmessage принимает event(событие)
    //     socket.onmessage = (event) => {

    //         console.log('С сервера пришло сообщение', event.data); // выводим в логи сообщение, в поле data у event(событие,параметр этой функции) находится сообщение,которое пришло от вебсокет сервера

    //     }

    // }, [])

    // функция для сохранения рисунка,но это немного костыльный способ,лучше загружать картинку на сервер,делать запрос на ее получение и тд
    const dowload = () => {

        const dataUrl = canvasState.canvas.toDataURL(); // сохраняем изображение с канваса с помощью toDataURL() в переменную dataUrl

        const a = document.createElement('a'); // создаем тег a(ссылку) с помощью document.createElement()

        a.href = dataUrl; // указываем этому тегу a(ссылке) в href нашу переменную dataUrl(то есть ссылку на нашу сохраненную картинку канваса)

        a.download = canvasState.sessionid + ".jpg"; // указываем полю download у этой ссылки,чтобы файл скачивался с таким-то названием и расширением,указываем название как canvasState.sessionid(id сессии,то есть текущего подключения к вебсокет серверу) и расширение указываем ".jpg"

        document.body.appendChild(a); // помещаем эту нашу ссылку(a) в тег body,то есть на наш сайт с помощью appendChild()

        a.click(); // нажимаем на эту ссылку с помощью click()

        document.body.removeChild(a); // удаляем эту нашу ссылку из тега body,то есть из нашего сайта с помощью removeChild()

    }

    return (
        <div className="toolbar" style={{top:70}}>

            {/* в onClick присваем инструмент как кисть(в данном случае), то есть изменяем состояние tool у toolState(типа редьюсер(для mobx просто создаются классы) для инструмента,которое мы сделали у mobx),в setTool() передаем новый объект,созданный на основе нашего класса Brush и в его конструктор передаем canvasState.canvas(ссылку на канвас,которую получили из состояния canvasState(у mobx) у поля canvas), canvasState.socket(вебсокет) и canvasState.sessionid(id сессии,то есть текущего подключения к вебсокет серверу) */}
            <button className="toolbar__btn" onClick={() => toolState.setTool(new Brush(canvasState.canvas, canvasState.socket, canvasState.sessionid))}>Кисть</button>

            {/* в onClick присваем инструмент как прямоугольник(в данном случае), то есть изменяем состояние tool у toolState(типа редьюсер(для mobx просто создаются классы) для инструмента,которое мы сделали у mobx),в setTool() передаем новый объект,созданный на основе нашего класса Rect и в его конструктор передаем canvasState.canvas(ссылку на канвас,которую получили из состояния canvasState(у mobx) у поля canvas) */}
            <button className="toolbar__btn" onClick={() => toolState.setTool(new Rect(canvasState.canvas,canvasState.socket,canvasState.sessionid))}>Прямоугольник</button>

            {/* указываем тип этому инпуту как color,чтобы сделать палитру цветов, в onChange указываем нашу функцию changeColor,куда передаем e(event),чтобы можно было в этой функции обращаться к этому инпуту */}
            <input type="color" className="toolbar__colorInput" onChange={e => changeColor(e)} />

            {/* в onClick указываем нашу функцию undo() у canvasState,которая отменяет действие */}
            <button className="toolbar__btn" onClick={() => canvasState.undo()}>Отмена действия</button>

            {/* в onClick указываем нашу функцию redo() у canvasState,которая возвращает действие вперед */}
            <button className="toolbar__btn" onClick={() => canvasState.redo()}>Возврат действия</button>

            {/* в onClick указываем нашу функцию download() (то есть вызываем ее),которая скачивает картинку канваса на компьютер */}
            <button className="toolbar__btn" onClick={() => dowload()}>Сохранить рисунок</button>


            {/* закомментировали эту кнопку,так как она была просто тестовой,и почти такой же функционал сделали в файле Canvas.tsx */}
            {/* это просто тестовая кнопка,чтобы проверить,установлено ли подключение к нашему вебсокет серверу,эту кнопку можно не делать,просто для теста,в onClick указываем нашу тестовую функцию testWs */}
            {/* <button className="toolbar__btn" onClick={testWs}>Send test websocket</button> */}

        </div>
    )

}

export default Toolbar;