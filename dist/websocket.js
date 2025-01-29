"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
exports.server = http.createServer(app);
const io = new Server(exports.server);
io.on("connection", (socket) => {
    console.log("Nouvelle connexion WebSocket établie");
    socket.on("error", (err) => {
        console.error(`Erreur WebSocket : ${err.message}`);
    });
    socket.on("disconnect", () => {
        console.log("Un utilisateur s'est déconnecté");
    });
    socket.on("joinFamily", (familyId) => {
        if (!familyId) {
            console.error("ID de la famille manquant");
            return;
        }
        socket.join(familyId);
        console.log(`Utilisateur rejoint la famille : ${familyId}`);
    });
    socket.on("sendMessage", (data) => {
        const { familyId, senderId, content } = data;
        console.log(`Message reçu : ${content} de ${senderId} pour la famille ${familyId}`);
    });
});
