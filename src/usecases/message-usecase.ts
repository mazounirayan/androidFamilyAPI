import { DataSource } from "typeorm";
import { Message } from "../database/entities/message";
import { User } from "../database/entities/user";
import { Chat } from "../database/entities/chat";

export class MessageUsecase {
    constructor(private readonly db: DataSource) {}

    // Create a new message
    async createMessage(messageData: Partial<Message>) {
        const repo = this.db.getRepository(Message);
        const userRepo = this.db.getRepository(User);
        const chatRepo = this.db.getRepository(Chat);
    
        const user = await userRepo.findOne({ where: { id: messageData.user?.id } });
        const chat = await chatRepo.findOne({ where: { idChat: messageData.chat?.idChat } });
    
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
            .leftJoinAndSelect('message.user', 'user')      
            .where("message.idChat = :idChat", { idChat }) 
            .orderBy('message.date_envoie', 'ASC')         
            .skip((page - 1) * limit)
            .take(limit)
            .getMany();
    }

    async newMessageOfUser(idUser: number, date:Date): Promise<Message[]> {
        const repo = this.db.getRepository(Message);
    
        console.log(idUser)
        return repo.createQueryBuilder("message")
            .leftJoinAndSelect('message.user', 'user')      
            .where("message.idUser = :idUser", { idUser })
            .andWhere("message.date_envoie <= :date", {date}) 
            .getMany();
    }
}    
