import express from "express";
import { initRoutes } from "./routes/routes";
import { AppDataSource } from "./database/database";
import {websocket} from "./websocket"
import { io } from "socket.io-client";
const main = async () => {
    const app = express()
    const port = 3006

    try {
        
        var cors = require('cors')
        app.use(cors()) // Use this after the variable declaration
        await AppDataSource.initialize()
        console.error("well connected to database")
    } catch (error) {
        console.log(error)
        console.error("Cannot contact database")
        process.exit(1)
    }
    app.use(cors());
   

    app.use(express.json())
    
    //swaggerDocs(app, port)


    initRoutes(app)
    app.listen(port, () => {
        console.log(`Server running on port ${port}`)
    })

    /*await websocket();

    const client = io("ws://localhost:3000");
    
    client.on('connect', () => {
        console.log("Connexion établie avec le serveur WebSocket");
    
        client.emit("joinFamily", 2); 
        client.emit("sendMessage", { familyId: 2, senderId: 1, content: "Salut" });
    });
    
    client.on('message', (data:any) => {
        console.log(`Message reçu du serveur : ${data}`);
    });
    
    client.on('error', (err:any) => {
        console.error(`Erreur côté client : ${err.message}`);
    });
    
    client.on('close', () => {
        console.log("Connexion fermée par le serveur");
    })*/

}


main()
