import { DataSource } from "typeorm";
import { Message } from "../database/entities/message";
import { User } from "../database/entities/user";
import { Chat } from "../database/entities/chat";

export class MessageUsecase {
    constructor(private readonly db: DataSource) {}

    // Create a new message
    async createMessage(messageData: Partial<any>) {
        const repo = this.db.getRepository(Message);
        const userRepo = this.db.getRepository(User);
        const chatRepo = this.db.getRepository(Chat);

        const user = await userRepo.findOne({ where: { id: messageData.idUser } });
        const chat = await chatRepo.findOne({ where: { idChat: messageData.idChat } });
    
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
    
        return await repo.save(message);
    }
    

    async listMessagesByChat(page: number = 1, limit: number = 10, idChat?: number): Promise<Message[]> {
        const repo = this.db.getRepository(Message);
    
        return repo.createQueryBuilder("message")
            .where("message.idChat = :idChat", { idChat }) 
            .orderBy('message.date_envoie', 'ASC')
            .leftJoinAndSelect('message.user', 'user')      
            .getMany();
    }
     
    async newMessageOfUser(idUser: number, lastMessageId: number): Promise<Message[]> {
        const rawData = await this.db.query(
            `SELECT DISTINCT idMessage, contenu, date_envoie, isVue, Message.idUser, Message.idChat 
             FROM Message 
             INNER JOIN Chat ON Message.idChat = Chat.idChat 
             INNER JOIN User ON Message.idUser = User.id 
             WHERE User.id = ? AND Message.idMessage > ?`,
            [idUser, lastMessageId]
        );
    
        return rawData; // Retourne les résultats bruts
    }
    
}    
