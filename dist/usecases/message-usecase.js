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
class MessageUsecase {
    constructor(db) {
        this.db = db;
    }
    // Create a new message
    createMessage(messageData) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.db.getRepository(message_1.Message);
            const message = repo.create(messageData);
            return yield repo.save(message);
        });
    }
    listMessagesByChat() {
        return __awaiter(this, arguments, void 0, function* (page = 1, limit = 10, idChat) {
            const repo = this.db.getRepository(message_1.Message);
            const query = repo.createQueryBuilder("message");
            if (idChat) {
                query.where("message.idChat LIKE :idChat", { idChat: `%${idChat}%` });
            }
            query.skip((page - 1) * limit).take(limit);
            return query.getMany();
        });
    }
}
exports.MessageUsecase = MessageUsecase;
