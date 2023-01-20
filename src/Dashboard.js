import React from "react";
import useAuth from "./useAuth";

export default function Dashboard(props){
    window.location.hash = ""



    //const accessToken = useAuth(token);
    localStorage.setItem("accessToken", JSON.stringify(props.token.access_token))
    return (
        <div>
            {props.token.access_token}
            {props.token.expires_in}
            <p>{props.token.token_type}</p>
        </div>
    )
}

