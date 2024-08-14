import express from "express"
import { createServer } from "http";
import { Server } from "socket.io";


const app = express()
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173"
      }
});


app.get("/",(req,res)=>{
    res.send("hello world")
})
io.on("connection", (socket) => {
    console.log(socket.id)
    socket.on("data",(data)=>{
        // console.log(data)
    })
    socket.on("send-location",({latitude,longitude})=>{
        // console.log("location",latitude,longitude)
        io.emit("recived-location",{id:socket.id,latitude,longitude})
    })

    socket.on("disconect",()=>{
        io.emit("user-disconnected",{id:socket.id})
    })
});

httpServer.listen(3000,()=>{
    console.log("server Listening")
});


