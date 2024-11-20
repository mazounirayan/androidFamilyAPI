import express, { Request, Response } from "express";
import { invalidPathHandler } from "../errors/invalid-path-handler";
import { UserHandlerAuthentication } from "./users/userAuthentication";
import { UserHandler } from "./users/user";
import { FamilleHandler } from "./famille";
import { TacheHandler } from "./tache";
import { MessageHandler } from "./message";
import { ChatHandler } from "./chat";
import { RecompenseHandler } from "./recompense";
import { NotificationHandler } from "./notification";



export const initRoutes = (app: express.Express) => {

    app.get("/health", (req: Request, res: Response) => {
        res.send({ "message": "succes" })
    })


    UserHandlerAuthentication(app);
    UserHandler(app);
    FamilleHandler(app);
    TacheHandler(app);
    MessageHandler(app)
    ChatHandler(app)
    RecompenseHandler(app)
    NotificationHandler(app)
    app.use(invalidPathHandler);
}
