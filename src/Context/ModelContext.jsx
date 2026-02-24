import React,{useState} from "react";

const ModeContext=React.createContext({
    mode:"light",
    toggleMode:() =>{ },
});
export const ModeContextProvider=(props)=>{
    const[mode,setmode]= useState("light");
    const toggleMode = () =>{
        if(mode=== "light"){
            setmode("dark");

        }else{
            setmode("light");
        }
    };
    return(
        <ModeContext.Provider value={{mode:mode,toggleMode}}>  
        {props.children}
        </ModeContext.Provider>
          
          
    );
};
export default ModeContext;