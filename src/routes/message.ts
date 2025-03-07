import express, { Request, Response } from "express";
import { AppDataSource } from "../database/database";
import { MessageUsecase } from "../usecases/message-usecase";
import { createMessageValidation } from "../validators/message-validator";

export const MessageHandler = (app: express.Express) => {
    const messageUsecase = new MessageUsecase(AppDataSource);

    // Create a new message
    app.post("/messages", async (req: Request, res: Response) => {
        const validation = createMessageValidation.validate(req.body);
        if (validation.error) {
            return res.status(400).send(validation.error.details);
        }

        try {
            const message = await messageUsecase.createMessage(validation.value);
            res.status(201).send(message);
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: "Internal server error" });
        }
    });

    // Get all messages for a specific chat
    app.get("/messages/chat/:chatId", async (req: Request, res: Response) => {
        try {
            const chatId = parseInt(req.params.chatId, 10);
            if (isNaN(chatId)) {
                return res.status(400).send({ error: "Invalid chatId parameter" });
            }
            const page = parseInt(req.query.page as string, 10) || 1;
            const limit = parseInt(req.query.limit as string, 10) || 10;
            const messages = await messageUsecase.listMessagesByChat(page, limit, chatId);
            res.status(200).send(messages);
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: "Internal server error" });
        }
    });
    
    app.get("/messages/new/:userId/:date", async (req: Request, res: Response) => {
        try {
            const userId = req.params.userId
            const lastMessageId = req.params.date
            
            const messages = await messageUsecase.newMessageOfUser(+userId, +lastMessageId);
            res.status(200).send(messages);
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: "Internal server error" });
        }
    });

    app.get("/messages/maxid/:userId/", async (req: Request, res: Response) => {
        try {
            const userId = req.params.userId
            
            const idMessage = await messageUsecase.getMaxMessageIdForUser(+userId);
            return res.status(200).json({ maxIdMessage: idMessage });
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: "Internal server error" });
        }
    });
    
};
