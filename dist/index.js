"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = require("./routes/routes");
const database_1 = require("./database/database");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = (0, express_1.default)();
    const port = 3006;
    try {
        var cors = require('cors');
        app.use(cors()); // Use this after the variable declaration
        yield database_1.AppDataSource.initialize();
        console.error("well connected to database");
    }
    catch (error) {
        console.log(error);
        console.error("Cannot contact database");
        process.exit(1);
    }
    app.use(cors());
    app.use(express_1.default.json());
    //swaggerDocs(app, port)
    (0, routes_1.initRoutes)(app);
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
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
});
main();
