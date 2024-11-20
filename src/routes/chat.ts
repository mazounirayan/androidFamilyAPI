import express, { Request, Response } from "express";
import { AppDataSource } from "../database/database";
import { ChatUsecase } from "../usecases/chat-usecase";
import { createChatValidation } from "../validators/chat-validator";

export const ChatHandler = (app: express.Express) => {
    const chatUsecase = new ChatUsecase(AppDataSource);

    // Create a chat
    app.post("/chats", async (req: Request, res: Response) => {
        const validation = createChatValidation.validate(req.body);
        if (validation.error) {
            return res.status(400).send(validation.error.details);
        }

        try {
            const chat = await chatUsecase.createChat(validation.value);
            res.status(201).send(chat);
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: "Internal server error" });
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
};