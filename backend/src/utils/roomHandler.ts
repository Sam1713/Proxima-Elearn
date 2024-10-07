// import { Socket } from "socket.io";
// import {v4 as uuid} from 'uuid'

// export const roomHandler=(socket:Socket)=>{
//     const createRoom=()=>{
//         const roomId=uuid()   
//         socket.join(roomId)
//         socket.emit("room-created",{roomId})
//         console.log("Room Created");
        
//     }
//     const joinRoom=({roomId}:{roomId:string})=>{
//         console.log("joined room",roomId);
        
//     }
        
//       socket.on("create-room",createRoom)
//       socket.on("join-room",joinRoom)
       
// }     