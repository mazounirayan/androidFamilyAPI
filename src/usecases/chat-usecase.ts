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
          .leftJoinAndSelect("chat.messages", "message", 
            "message.idChat = chat.idChat AND message.idMessage = (SELECT MAX(m.idMessage) FROM Message m WHERE m.idChat = chat.idChat)")
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
      }
    
    

    
}
