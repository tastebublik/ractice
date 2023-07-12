import appConstants from "../common/constants.js";
import Route from 'route-parser';

import MainPage from '../pages/main.template';
import CreatePage from '../pages/create.template';



export const routes = {
    Main: new Route(appConstants.routes.index),
    Create: new Route(appConstants.routes.create),
    Contact:new Route(appConstants.routes.contact)
}

export const render = (path) => {
    let result = '<h1> 404</h1>'

    if (routes.Main.match(path)){
        result = MainPage()
    }
    if (routes.Create.match(path)){
        result =CreatePage()
    }

    document.querySelector('#app').innerHTML=result
}

export const goTo = (path)=>{
    window.history.pushState({path}, path, path)
    render(path)
}

export const initRouter = ()=>{
    window.addEventListener('popstate',()=>{
        return new URL(window.location.href).pathname
    })
    document.querySelectorAll(`[href^='/']`).forEach(el=>{
        el.addEventListener('click',(e)=>{
            e.preventDefault()
            const {pathname:path}=new URL(window.location)
            goTo(path)
        })
    })
    render(new URL(window.location.href).pathname)
}

export default initRouter