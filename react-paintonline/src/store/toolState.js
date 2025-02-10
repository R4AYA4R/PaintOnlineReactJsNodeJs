
import { makeAutoObservable } from 'mobx'; // импортируем makeAutoObservable из mobx,чтобы сделать данные,которые хранятся в этом классе, отслеживаемыми для mobx

class ToolState {

    tool = null; // указываем поле tool со значением null по дефолту

    constructor(){

        makeAutoObservable(this); // вызываем метод makeAutoObservable() и передаем туда this,чтобы сделать данные,которые хранятся в этом классе, отслеживаемыми для mobx,и когда будем изменять данные в этом классе,реакт будет отслеживать это и перерендеривать компонент

    }

    // создаем функцию(типа action как в redux toolkit),которая будет изменять поле tool в данном случае
    setTool(tool){

        this.tool = tool; // изменяем поле tool этого класса(this) на параметр этой функции tool

    }

    setFillColor(color){

        this.tool.fillColor = color; // вызываем нашу функцию сеттер fillColor у this.tool(она меняет цвет заполнения фигуры,мы это прописали в файле Tool.js) и указываем значение для этого сеттера как color(параметр этой функции setFillColor)

    }

    setStrokeColor(color){

        this.tool.strokeColor = color; // вызываем нашу функцию сеттер strokeColor у this.tool(она меняет цвет обводки фигуры,мы это прописали в файле Tool.js) и указываем значение для этого сеттера как color(параметр этой функции setStrokeColor)

    }

    setLineWidth(width){

        this.tool.lineWidth = width; // вызываем нашу функцию сеттер lineWidth у this.tool(она меняет ширину линии фигуры,мы это прописали в файле Tool.js) и указываем значение для этого сеттера как width(параметр этой функции setLineWidth)

    }

}

export default new ToolState(); // экспортируем объект на основе нашего класса ToolState(),в данном случае это будет состояние,которое мы будем использовать