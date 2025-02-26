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
            var _a, _b;
            const repo = this.db.getRepository(message_1.Message);
            const userRepo = this.db.getRepository(user_1.User);
            const chatRepo = this.db.getRepository(chat_1.Chat);
            const user = yield userRepo.findOne({ where: { id: (_a = messageData.user) === null || _a === void 0 ? void 0 : _a.id } });
            const chat = yield chatRepo.findOne({ where: { idChat: (_b = messageData.chat) === null || _b === void 0 ? void 0 : _b.idChat } });
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
                .leftJoinAndSelect('message.user', 'user')
                .where("message.idChat = :idChat", { idChat })
                .orderBy('message.date_envoie', 'ASC')
                .skip((page - 1) * limit)
                .take(limit)
                .getMany();
        });
    }
    newMessageOfUser(idUser, date) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.db.getRepository(message_1.Message);
            console.log(idUser);
            return repo.createQueryBuilder("message")
                .leftJoinAndSelect('message.user', 'user')
                .where("message.idUser = :idUser", { idUser })
                .andWhere("message.date_envoie > :date", { date })
                .getMany();
        });
    }
}
exports.MessageUsecase = MessageUsecase;
