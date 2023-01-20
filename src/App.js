import React, { useState, useEffect } from "react";
import Login from "./Login";
//import Dashboard from "./Dashboard";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function App(){
    const [tokken, setTokken] = useState("")
    const [type, setType] = useState("")

    const token = window.localStorage.getItem("accessToken");
    let toke = {}
    let dash = window.location.hash;
    if(!token && dash){
        const hash = window.location.hash.substring(1).split("&");
        if(token && hash) return
        hash.forEach(value=>{
            let arr = value.split("=")
            toke[arr[0]] = arr[1]
        })
        console.log(toke)
        localStorage.setItem("accessToken", toke["access_token"])
        //window.location.hash = ""
    }

    const handleSearch = async (e) =>{
        e.preventDefault()
        console.log("JSON.stringify(data)")
        const {data} = await axios.get("https://api.spotify.com/v1/search" , {
            headers: {
                Authorization: "Bearer "+ token
            },
            params :{
                q: type,
                type: "artist"
            }
        })

        console.log(JSON.stringify(data))
        setTokken(data.artists.items)
    }

    function playMe(id){
        let sound = document.getElementById(id)
        sound.play()
        console.log(id, "to be played")
    }

    return (
        <>
            {!token ? <Login /> :""}
            {token? 
            <div>
                <form onSubmit={handleSearch}>
                    <input type="text" value={type} onChange={(e)=>setType(e.target.value)} />
                    <button type={"submit"}>Search</button>
                    <p>{type}</p>
                    <p>{tokken&&tokken.map((value, id)=>{
                        return (
                        <div key={id}>
                            <p >{value.name}______{value.id}</p>
                            <img src={value.images[2].url}  alt={id} />
                        </div>
                        )
                    })}</p>
                </form>

                <button onClick={()=>{window.localStorage.removeItem("accessToken"); setTokken("")}}>Log Out</button>
            </div>:""}
        </>
        )
}


//#access_token=BQBVzOn9zxdE2XCnez2Q0mst8raWmXQ0tJaqPq67BLwIboQGeAjJSqi-VDrHvHDeHRws61z1Z9mCU9Bp6M38j7AHjaUc7rARh8vlzGobbiqwjIQe_nEk90LUaoG20Hb3aOKCcdqyL5wn5gFCvYw4TTXKKdbqrlHWX1AxY1C66O7Urv-jzhbu9O0yR0ovbFi5eELD0ZFIG_wr33itTKkklGtnk5Q-oGzsav-c92U3ZV-yaywK0w
//&token_type=Bearer
//&expires_in=3600