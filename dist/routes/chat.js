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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatHandler = void 0;
const database_1 = require("../database/database");
const chat_usecase_1 = require("../usecases/chat-usecase");
const chat_validator_1 = require("../validators/chat-validator");
const ChatHandler = (app) => {
    const chatUsecase = new chat_usecase_1.ChatUsecase(database_1.AppDataSource);
    // Create a chat
    app.post("/chats", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = chat_validator_1.createChatValidation.validate(req.body);
        if (validation.error) {
            return res.status(400).send(validation.error.details);
        }
        try {
            const chat = yield chatUsecase.createChat(validation.value);
            res.status(201).send(chat);
        }
        catch (error) {
            console.error(error);
            res.status(500).send({ error: "Internal server error" });
        }
    }));
    // List all chats
    app.get("/chats", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const chats = yield chatUsecase.listChats();
            res.status(200).send(chats);
        }
        catch (error) {
            console.error(error);
            res.status(500).send({ error: "Internal server error" });
        }
    }));
};
exports.ChatHandler = ChatHandler;
