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
    async addUserToChat(userId: number, chatId: number) {
        return await this.db.createQueryBuilder()
            .insert()
            .into("user_chats_chat") // Nom de la table de relation
            .values({ idUser: userId, idChat: chatId })
            .execute();
    }
}
