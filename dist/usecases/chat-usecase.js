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
exports.ChatUsecase = void 0;
const chat_1 = require("../database/entities/chat");
class ChatUsecase {
    constructor(db) {
        this.db = db;
    }
    createChat(chatData) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.db.getRepository(chat_1.Chat);
            const chat = repo.create(chatData);
            return yield repo.save(chat);
        });
    }
    listChats() {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.db.getRepository(chat_1.Chat);
            return yield repo.find();
        });
    }
    addUserToChat(userId, chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.createQueryBuilder()
                .insert()
                .into("user_chats_chat") // Nom de la table de relation
                .values({ idUser: userId, idChat: chatId })
                .execute();
        });
    }
}
exports.ChatUsecase = ChatUsecase;
