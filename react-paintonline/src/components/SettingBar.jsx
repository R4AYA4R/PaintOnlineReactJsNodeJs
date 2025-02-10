import toolState from "../store/toolState";

const SettingBar = () => {

    return(
        <div className="toolbar settingBar" style={{top:130}}>  

            {/* создаем label и в htmlFor указываем id инпута,для которого этот label,то есть при нажатии на этот label будет фокус на инпуте,можно было и просто инпут засунуть в label,но можно и так */}
            <label htmlFor="line-width">Толщина линии</label>
            <input style={{margin:'0 10px'}} id="line-width" type="number" defaultValue={1} min={1} max={50} onChange={e => toolState.setLineWidth(e.target.value)} /> {/* создаем инпут для толщины линии,указываем ему тип number,минимальное(min) значение 1,а максимальное(max) 50,дефолтное значение(defaultValue) 1, в onChange указываем action(типа функция,которая изменяет состояние для mobx) setLineWidth,и передаем туда параметром e.target.value,таким образом изменяем состояние толщины линии на значение,которое в инпуте */}

            {/* создаем label и в htmlFor указываем id инпута,для которого этот label,то есть при нажатии на этот label будет фокус на инпуте,можно было и просто инпут засунуть в label,но можно и так */}
            <label htmlFor="stroke-color">Цвет обводки</label>

            {/* указываем тип этому инпуту как color,чтобы сделать палитру цветов, в onChange меняем цвет обводки с помощью setStrokeColor(),в нее передаем e.target.value(текущее значение инпута,то есть текущий цвет) */}
            <input type="color" id="stroke-color" onChange={e => toolState.setStrokeColor(e.target.value)}/>

        </div>
    )

}

export default SettingBar;