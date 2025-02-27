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
exports.MessageUsecase = void 0;
const message_1 = require("../database/entities/message");
const user_1 = require("../database/entities/user");
const chat_1 = require("../database/entities/chat");
class MessageUsecase {
    constructor(db) {
        this.db = db;
    }
    // Create a new message
    createMessage(messageData) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.db.getRepository(message_1.Message);
            const userRepo = this.db.getRepository(user_1.User);
            const chatRepo = this.db.getRepository(chat_1.Chat);
            const user = yield userRepo.findOne({ where: { id: messageData.idUser } });
            const chat = yield chatRepo.findOne({ where: { idChat: messageData.idChat } });
            if (!user || !chat) {
                throw new Error("User or Chat not found");
            }
            // Créer le message avec les relations correctement définies
            const message = repo.create({
                contenu: messageData.contenu,
                date_envoie: messageData.date_envoie,
                isVue: messageData.isVue,
                user, // Relation User
                chat, // Relation Chat
            });
            return yield repo.save(message);
        });
    }
    listMessagesByChat() {
        return __awaiter(this, arguments, void 0, function* (page = 1, limit = 10, idChat) {
            const repo = this.db.getRepository(message_1.Message);
            return repo.createQueryBuilder("message")
                .where("message.idChat = :idChat", { idChat })
                .orderBy('message.date_envoie', 'ASC')
                .leftJoinAndSelect('message.user', 'user')
                .getMany();
        });
    }
    newMessageOfUser(idUser, lastMessageId) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.db.query(`SELECT DISTINCT     m.idMessage, m.contenu, m.date_envoie, m.isVue, m.idUser, m.idChat 
             FROM Message m
             WHERE m.idMessage > ? AND m.idChat IN (SELECT DISTINCT uc.idChat FROM user_chats_chat uc WHERE uc.idUser = ?)`, [lastMessageId, idUser]);
            return rawData; // Retourne les résultats bruts
        });
    }
}
exports.MessageUsecase = MessageUsecase;
