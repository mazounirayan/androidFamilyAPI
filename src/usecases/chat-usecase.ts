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
            .into("user_chats_chat")  
            .values({ idUser: userId, idChat: chatId })
            .execute();
    }
    async listChatsByUser(userId: number): Promise<any[]> {
        const chatRepository = this.db.getRepository(Chat);
        const chats = await chatRepository.createQueryBuilder("chat")
            .leftJoinAndSelect("chat.participants", "user")
            .leftJoinAndSelect("chat.messages", "message")
            .where("user.id = :userId", { userId })
            .getMany();
    
        chats.forEach(chat => {
            chat.messages.sort((a, b) => b.date_envoie.getTime() - a.date_envoie.getTime());
        });
    
        return chats.map(chat => ({
            id: chat.idChat,
            name: chat.libelle,
            participants: chat.participants.map(user => user.nom),
            lastMessage: chat.messages[0] ? chat.messages[0].contenu : "No messages",
            messageTime: chat.messages[0] ? chat.messages[0].date_envoie : null,
        }));
    }
    
    
    

    
}
