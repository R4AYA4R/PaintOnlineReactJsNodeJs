import { useRef, useState } from "react";
import canvasState from "../store/canvasState";

const InputForModal = () => {

    const [visibleBtn,setVisibleBtn] = useState(true); // состояние для того,чтобы показывать или не показывать кнопку войти 

    const usernameRef = useRef(); // создаем ссылку для инпута с именем пользователя с помощью useRef()

    const connectHandler = () => {

        canvasState.setUsername(usernameRef?.current?.value); // изменяем поле username у этого состояния canvasState у mobx на значение в инпуте для имени пользователя(usernameRef.current.value)

        setVisibleBtn(false); // убираем кнопку войти

    }

    return (

        <div className="toolbar">

            <h1>Введите ваше имя</h1>

            <input type="text" ref={usernameRef} style={{margin:"0 10px"}}/>

            {/* если состояние visibleBtn true,то показываем кнопку(делаем ей display:"block",в другом случае скрываем кнопку (display:"none"),лучше было это сделать с обычными css классами,но указали в поле style просто,чтобы было быстрее и так как это тестовый проект) */}
            <button style={visibleBtn ? {display:"block"} : {display:"none"}} onClick={() => connectHandler()}>Войти</button>

        </div>

    )

}

export default InputForModal;