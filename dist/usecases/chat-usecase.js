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
                .into("user_chats_chat")
                .values({ idUser: userId, idChat: chatId })
                .execute();
        });
    }
    listChatsByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const chatRepository = this.db.getRepository(chat_1.Chat);
            const chats = yield chatRepository.createQueryBuilder("chat")
                .leftJoinAndSelect("chat.participants", "user")
                .leftJoinAndSelect("chat.messages", "message", "message.idMessage = (SELECT MAX(m.idMessage) FROM message m WHERE m.chatIdChat = chat.idChat)")
                .where("user.id = :userId", { userId })
                .getMany();
            return chats.map(chat => {
                chat.messages.sort((a, b) => b.date_envoie.getTime() - a.date_envoie.getTime());
                const lastMessage = chat.messages[0];
                return {
                    id: chat.idChat,
                    name: chat.libelle,
                    participants: chat.participants.map(user => user.nom),
                    lastMessage: lastMessage ? lastMessage.contenu : "No messages",
                    messageTime: lastMessage ? lastMessage.date_envoie : null,
                };
            });
        });
    }
}
exports.ChatUsecase = ChatUsecase;
