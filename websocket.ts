const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
export const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket:any) => {
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

    });


});


