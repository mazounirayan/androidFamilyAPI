import { DataSource } from "typeorm";
import { Message } from "../database/entities/message";

export class MessageUsecase {
    constructor(private readonly db: DataSource) {}

    // Create a new message
    async createMessage(messageData: Partial<Message>) {
        const repo = this.db.getRepository(Message);
        const message = repo.create(messageData);
        return await repo.save(message);
    }


    async listMessagesByChat(page: number = 1, limit: number = 10,idChat?: number): Promise<Message[]> {
        const repo = this.db.getRepository(Message);
        const query = repo.createQueryBuilder("message");
        if (idChat) {
            query.where("message.idChat LIKE :idChat", { idChat: `%${idChat}%` });
        }
        query.skip((page - 1) * limit).take(limit);
        return query.getMany();
    }
}
