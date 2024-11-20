import { DataSource } from "typeorm";
import { Chat } from "../database/entities/chat";

export class ChatUsecase {
    constructor(private readonly db: DataSource) {}

    async createChat(chatData: Partial<Chat>) {
        const repo = this.db.getRepository(Chat);
        const chat = repo.create(chatData);
        return await repo.save(chat);
    }

    async listChats() {
        const repo = this.db.getRepository(Chat);
        return await repo.find();
    }
}
