const express = require("express");
const socketIO = require("socket.io");
const PORT = 3000

export const websocket = async () => {

    const server = express().listen(PORT, ()=>{
        console.log(`Ws écoute sur le port ${PORT}`)
    });

 const socketHandler = socketIO(server)


    socketHandler.on("connection", (socket:any) => {
        console.log("Nouvelle connexion WebSocket établie");

        socket.on("error", (err:any) => {
            console.error(`Erreur WebSocket : ${err.message}`);
        });

        socket.on("disconnect", () => {
            console.log("Un utilisateur s'est déconnecté");
        });


        socket.on("joinFamily", (familyId:number) => {
            if (!familyId) {
                console.error("ID de la famille manquant");
                return;
            }
            socket.join(familyId);
            console.log(`Utilisateur rejoint la famille : ${familyId}`);
        });
        

        socket.on("sendMessage", (data:any) => {
            const { familyId, senderId, content } = data;
            console.log(`Message reçu : ${content} de ${senderId} pour la famille ${familyId}`);
            socket.emit("message",{"test":"test"})

        });

        socket.on("message", (data:any) => {
            console.log(`Message reçu : ${data}`);
            socket.emit("message",{"test":"test"})
            console.log("message test envoyé")
        });



    });

}
