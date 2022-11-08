


const db = require("./config/db.js");

let i = 0;
const socketServer = (server) => {
    const io = require("socket.io")(server, {
        cors: {
            origin: "http://localhost:3000",
        },
    });

    io.on("connection", (socket) => {
        console.log(`socket ${socket.id} connected`);

        // send an event to the client
        socket.on("login", () => { // listen to the event
            const sql = `SELECT user_id FROM loggedinusers`;
            db.query(sql, (error, result) => {
				console.log(i++);
                if (error)
                    console.log(error);
                else {
                    console.log(result);
                    const users = result.map(user => {
                        return user.user_id;
                    })
                    console.log(users)
                    io.emit("logged", users);
                }
            })
            socket.on("disconnect", () => {
				console.log("User Disconnected", socket.id);
			});
        });

    })
} 

module.exports = {
    socketServer
};