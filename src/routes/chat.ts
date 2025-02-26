import express, { Request, Response } from "express";
import { AppDataSource } from "../database/database";
import { ChatUsecase } from "../usecases/chat-usecase";
import { addUserToChat, createChatValidation } from "../validators/chat-validator";
import { generateValidationErrorMessage } from "../validators/generate-validation-message";

export const ChatHandler = (app: express.Express) => {
    const chatUsecase = new ChatUsecase(AppDataSource);
    app.post("/chats", async (req: Request, res: Response) => {
        const validation = createChatValidation.validate(req.body);
    
         if (validation.error) {
            return res.status(400).send({
                error: validation.error.details.map((d) => d.message).join(", ")
            });
        }
    
        try {
            const { libelle, participants } = validation.value;
    
             const chat = await chatUsecase.createChat(libelle, participants);
            res.status(201).send(chat);  
        } catch (error) {
             res.status(500).send({ error: "Erreur interne du serveur" });
        }
    });
    
    
    // List all chats
    app.get("/chats", async (_req: Request, res: Response) => {
        try {
            const chats = await chatUsecase.listChats();
            res.status(200).send(chats);
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: "Internal server error" });
        }
    });

    app.post("/chats/user", async (req: Request, res: Response) => {
        const validation = addUserToChat.validate(req.body);
        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }

        const { idUser, idChat } = validation.value;

        try {
            const chatUsecase = new ChatUsecase(AppDataSource);
            await chatUsecase.addUserToChat(idUser, idChat);
            res.status(201)

        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });
    
    app.get("/users/:userId/chats", async (req: Request, res: Response) => {
        const userId = parseInt(req.params.userId);
        if (isNaN(userId)) {
            return res.status(400).send({ error: "Invalid user ID provided" });
        }

        try {
            const chats = await chatUsecase.listChatsByUser(userId);
            res.status(200).send(chats);
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: "Internal server error" });
        }
    });

    app.delete("/quitChat/:userId/:chatId", async (req: Request, res: Response) => {
        const userId = parseInt(req.params.userId);
        const chatId = parseInt(req.params.chatId);

        if (isNaN(userId) && isNaN(chatId)) {
            return res.status(400).send({ error: "Invalid user or chat ID provided" });
        }

        try {
            await chatUsecase.quitConv(userId, chatId);
            res.status(201).send();
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: "Internal server error" });
        }
    });


};
