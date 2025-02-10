import { Navigate, Route, Routes } from "react-router-dom";
import Canvas from "./components/Canvas";
import SettingBar from "./components/SettingBar";
import Toolbar from "./components/Toolbar";
import InputForModal from "./components/InputForModal";

// устанавливаем npm i mobx mobx-react-lite(чтобы использовать mobx,в данном случае используем mobx вместо redux toolkit,можно было и redux использовать,но уже сделали так),устанавливаем также npm i react-router-dom,чтобы работать с маршрутами(страницами),устанавливаем npm i axios,чтобы делать запросы на сервер

function App() {
  return (
    <div className="app">
      <Routes>

        {/* создаем маршрут и в element указываем пустой тег(он просто служит пустой оберткой,потому что в element можно указать только один типа компонент(тег) и указываем эти разные компоненты,можно было их вынести в один другой компонент и сразу указать просто его без этого пустого тега,но уже сделали так),в path указываем url с динамическим id(он может быть разным),и по этому url будет открываться эта страница(то есть будут показаны эти компоненты <Toolbar/> и тд, этот динамический id будем использовать в том случае,если его нет) */}
        <Route path="/:id" element={

          <>
            <InputForModal/>
            <Toolbar />
            <SettingBar />
            <Canvas />
          </>

        } />


        {/* когда url /(то есть дефолтный при запуске сайта),то перенаправляем пользователя с помощью <Navigate/> на маршрут с динамическим id, в to у <Navigate/> указываем этот типа уникальный id,указываем текущую дату(Date) и приводим ее в формат строки с помощью toString(),в toString() указываем 16,это просто параметр,который определяет систему счисления,при разных значениях(от 2 до 36) будут вместо цифр буквы и тд,в данном случае это просто типа для уникального id,в данном случае при открытии сайта сразу будет перенаправлять пользователя на страницу с уникальным id(а этот типа уникальный id указываем в to у <Navigate/>) в итоге будут показаны элементы,которые в маршруте /:id,то есть весь канвас,его toolbar и тд,и при открытии этого сайта в другой вкладке или другом браузере,то этот уникальный id уже будет другой */}
        <Route path="/" element={<Navigate to={`f${(+new Date).toString(16)}`} />} />

      </Routes>

    </div>
  );
}

export default App;
