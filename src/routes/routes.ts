import express, { Request, Response } from "express";
import { invalidPathHandler } from "../errors/invalid-path-handler";
import { UserHandlerAuthentication } from "./users/userAuthentication";
import { UserHandler } from "./users/user";
import { FamilleHandler } from "./famille";
import { TacheHandler } from "./tache";



export const initRoutes = (app: express.Express) => {

    app.get("/health", (req: Request, res: Response) => {
        res.send({ "message": "succes" })
    })


    UserHandlerAuthentication(app);
    UserHandler(app);
    FamilleHandler(app);
    TacheHandler(app);
    app.use(invalidPathHandler);
}
