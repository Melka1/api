import React, { useState, useEffect } from "react";
import Login from "./Login";
//import Dashboard from "./Dashboard";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
let proStyle = {}

export default function App(){
    const [tokken, setTokken] = useState("")
    const [type, setType] = useState("")
    const [albums, setAlbums] = useState({
        id: "",
        data: []
    })

    const token = window.localStorage.getItem("accessToken");
    let toke = {}
    let dash = window.location.hash;
    useEffect(()=>{
        if(!token && dash){
            const hash = window.location.hash.substring(1).split("&");
            if(token && hash) return
            hash.forEach(value=>{
                let arr = value.split("=")
                toke[arr[0]] = arr[1]
            })
            console.log(toke)
            localStorage.setItem("accessToken", toke["access_token"])
        }
    }, [])

    const handleSearch = async (e) =>{
        e.preventDefault()
        console.log("JSON.stringify(data)")
        const {data} = await axios.get("https://api.spotify.com/v1/search?limit=10" , {
            headers: {
                Authorization: "Bearer "+ token
            },
            params :{
                q: type,
                type: "artist"
            }
        })

        console.log(data.artists.items)
        setTokken(data.artists.items)
    }
    
    const searchAlbum = async (e, id) =>{
        console.log("JSON.stringify(data)")
        const {data} = await axios.get(`https://api.spotify.com/v1/artists/${id}/albums?market=ES&limit=10&offset=1` , {
            headers: {
                Authorization: "Bearer "+ token
            },
         })

        console.log(id, data.items)
        setAlbums({id:id, data:data.items})
    }

    return (
        <>
            {!token ? <Login /> :""}
            {token? 
            <div className="app">
                <form id="0" onSubmit={handleSearch}>
                    <input type="text" value={type} onChange={(e)=>setType(e.target.value)} />
                    <button type={"submit"}>Search</button>
                    <button onClick={()=>{window.localStorage.removeItem("accessToken"); setTokken("")}}>Log Out</button>
                </form>
                <div  className="container">{tokken&&tokken.map((value, id)=>{
                    return (
                    <div key={id} className="profile" id={id+""} style={value.id===albums.id?proStyle:{}}>
                        <a href={"#0"}><img onClick={(e)=>searchAlbum(e, value.id)} width="150px" height="150px" src={value.images[1]?value.images[1].url:""}  alt={id} /></a>
                        <div>
                        <a href={"#0"}><h3 onClick={(e)=>searchAlbum(e, value.id)}>{value.name}</h3></a>
                            <hr/>
                            <p>{value.genres[0]}</p>
                            <p>{value.followers.total}</p>
                        </div>
                        {albums.data!=[]&&value.id===albums.id?
                            <div className="albums" >
                                {albums.data.map(val=>{
                                    proStyle = {gridColumn:"1/-1",gridRow:"1/2"}
                                    return (
                                        <div key={val.id} className="album">
                                            <img width="75px" height="75px" src={val.images[2]?val.images[2].url:""} alt={val.id} />
                                            <div>
                                                <h4>{val.name}</h4>
                                                <p>{val.release_date}</p>
                                                <p>{val.id}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        :""}
                        
                    </div>
                    )
                })}</div>
                                
            </div>:""}
        </>
        )
}

//https://api.spotify.com/v1/artists/{id}/albums