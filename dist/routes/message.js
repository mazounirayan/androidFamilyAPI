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
exports.MessageHandler = void 0;
const database_1 = require("../database/database");
const message_usecase_1 = require("../usecases/message-usecase");
const message_validator_1 = require("../validators/message-validator");
const MessageHandler = (app) => {
    const messageUsecase = new message_usecase_1.MessageUsecase(database_1.AppDataSource);
    // Create a new message
    app.post("/messages", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = message_validator_1.createMessageValidation.validate(req.body);
        if (validation.error) {
            return res.status(400).send(validation.error.details);
        }
        try {
            const message = yield messageUsecase.createMessage(validation.value);
            res.status(201).send(message);
        }
        catch (error) {
            console.error(error);
            res.status(500).send({ error: "Internal server error" });
        }
    }));
    // Get all messages for a specific chat
    app.get("/messages/chat/:chatId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const chatId = parseInt(req.params.chatId, 10);
            if (isNaN(chatId)) {
                return res.status(400).send({ error: "Invalid chatId parameter" });
            }
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;
            const messages = yield messageUsecase.listMessagesByChat(page, limit, chatId);
            res.status(200).send(messages);
        }
        catch (error) {
            console.error(error);
            res.status(500).send({ error: "Internal server error" });
        }
    }));
};
exports.MessageHandler = MessageHandler;
