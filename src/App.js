import React, { useState, useEffect } from "react";
import Login from "./Login";
import image from "./noimage.jpg"
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
    const [track, setTrack] = useState({
        id: "",
        data: []
    })
    const [currentArtist, setCurrentArtist] = useState("")
    const [play, setPlay] = useState({id:"", state:true})
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
    })

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
        setTrack({id:"",data:[]})
        console.log(data.artists.items)
        setTokken(data.artists.items)
    }
    
    const searchAlbum = async (e, id) =>{
        setCurrentArtist(id)
        console.log("JSON.stringify(data)")
        const {data} = await axios.get(`https://api.spotify.com/v1/artists/${id}/albums?limit=10&offset=1` , {
            headers: {
                Authorization: "Bearer "+ token
            },
         })

        console.log(id, data.items)
        setAlbums({id:id, data:data.items})
        setTrack({id:"", data:[]})
    }

    const searchTrack = async (e, id) =>{
        
        console.log("JSON.stringify(data)")
        const {data} = await axios.get(`https://api.spotify.com/v1/albums/${id}/tracks?&limit=10&offset=1` , {
            headers: {
                Authorization: "Bearer "+ token
            },
         }).catch(err => console.log(err))

        console.log(id, data.items)
        setTrack({id:id, data:data.items})
    }

    function handlePlay(id){
        setPlay({id:id, state:!play.state})
    }

    const style = {
        flexDirection: 'column',
        width: "40%",
        margin: "auto"
    }

    return (
        <>
            {!token ? <Login /> :""}
            {token? 
            <div className="app">
                <form id="0" onSubmit={handleSearch}>
                    <input type="text" value={type} onChange={(e)=>setType(e.target.value)} />
                    <button type={"submit"}>Search</button>
                    <button onClick={()=>{window.localStorage.removeItem("accessToken"); setTokken("");window.location = "/"}}>Log Out</button>
                </form>
                <div  className="container">{tokken&&tokken.map((value, id)=>{//mapping through artists
                    return (
                    <div className="profile-container" style={value.id===albums.id?proStyle:{}}>    
                        <div key={id} className="profile" id={id+""} >
                            <div className="artist" style={value.id===albums.id?style:{}}>
                                <a href={"#0"}>
                                    <img onClick={(e)=>searchAlbum(e, value.id)} width="150px" height="150px" src={value.images[1]?value.images[1].url:image}  alt={id} />
                                </a>
                                <div>
                                    <a href={"#0"}>
                                        <h3 onClick={(e)=>searchAlbum(e, value.id)}>{value.name}</h3>
                                    </a>
                                    <hr/>
                                    <p>{value.genres[0]}</p>
                                    <p>{value.followers.total}</p>
                                </div>
                            </div>
                            {albums.data.length!=0&&value.id===albums.id?//mapping through albums
                                <div className="albums" >
                                    {albums.data.map(val=>{
                                        proStyle = {gridColumn:"1/-1",gridRow:"1/2"}
                                        return (
                                            <div key={val.id} className="album" onClick={(e)=>searchTrack(e, val.id)}>
                                                <img width="75px" height="75px" src={val.images[2]?val.images[2].url:image} alt={val.id} />
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
                        {value.id==currentArtist&&track.data.length!=0?
                        <div className="tracks">
                            {track.data.map(val=>{
                                var inSeconds = Math.floor(val.duration_ms/1000);
                                var mm = Math.floor(inSeconds/60);
                                var ss = inSeconds - mm*60;
                                if(ss<10){
                                    ss = "0"+ss;
                                }
                                return (
                                    <div key={val.id} className="track" >
                                        <h5>{val.name}</h5>
                                        <p>Duration- {mm} : {ss}</p>
                                        <div className="control">
                                            <span class="material-symbols-outlined">
                                                skip_previous
                                                </span>
                                            <span class="material-symbols-outlined" onClick={()=>handlePlay(val.id)}>
                                                {play.id==val.id&&play.state?"play_circle":"pause_circle"}
                                            </span>
                                            <span class="material-symbols-outlined">
                                                skip_next
                                            </span>
                                            <span class="material-symbols-outlined">
                                                repeat
                                            </span>
                                            <span class="material-symbols-outlined">
                                                shuffle
                                            </span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>:""}
                    </div>
                    )
                })}</div>
                                
            </div>:""}
        </>
    )
}