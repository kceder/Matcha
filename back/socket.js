

import Server from "socket.io";
import db from "./config/db.js";


const socketServer = (server) => {
    const io = new Server(server);

    io.on("connection", (socket) => {
        console.log(`socket ${socket.id} connected`);

        // send an event to the client
        socket.emit("foo", "bar");

        socket.on("foobar", () => {
            console.log('fhg')
        });
    })
}

export default {socketServer};