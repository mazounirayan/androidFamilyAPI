import express, { Request, Response } from "express";
import { AppDataSource } from "../database/database";
import { ChatUsecase } from "../usecases/chat-usecase";
import { addUserToChat, createChatValidation } from "../validators/chat-validator";
import { generateValidationErrorMessage } from "../validators/generate-validation-message";

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
};
