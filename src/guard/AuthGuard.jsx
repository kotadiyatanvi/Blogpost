import {Navigate,Outlet }from "react-router-dom";
import Rootlayout from "../pages/RootLayout";

export default function AuthGuard(){
    const loginData=JSON.parse(localStorage.getItem("loginData"));

    if(! loginData){
        return<Navigate to="/login" replace/>;
    }
    return<Rootlayout/>;
}