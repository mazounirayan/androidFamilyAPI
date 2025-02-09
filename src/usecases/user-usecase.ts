import { DataSource, DeleteResult } from "typeorm";
import { User,UserRole } from "../database/entities/user";
import { Famille } from "../database/entities/famille";
import { TransactionCoins } from "../database/entities/transactionCoins";
import { Token } from "../database/entities/token";

export class UserUsecase {
    constructor(private readonly db: DataSource) {}

    // Créer un utilisateur
    async createUser(userData: Partial<User>) {
        const repo = this.db.getRepository(User);
        const user = repo.create(userData);
        return await repo.save(user);
    }


    async getUserByToken(tokenValue: string) {
        const tokenRepo = this.db.getRepository(Token);
    
        const token = await tokenRepo.findOne({
            where: { token: tokenValue },
            relations: {
                user: {
                    chats: true, 
                },
            },
        });
    
        if (!token) {
            throw new Error('Token invalide ou inexistant');
        }
    
        return token.user;
    }
    
    

    // Obtenir un utilisateur par son ID
    async getUserById(id: number) {
        const repo = this.db.getRepository(User);
        return await repo.findOneBy({ id });
    }

    // Mettre à jour un utilisateur
    async updateUser(id: number, updateData: Partial<User>) {
        const repo = this.db.getRepository(User);
        const user = await repo.findOneBy({ id });
        if (!user) throw new Error("User not found");
        Object.assign(user, updateData);
        return await repo.save(user);
    }

    // Supprimer un utilisateur
    async deleteUser(id: number) {
        const repo = this.db.getRepository(User);
        const user = await repo.findOneBy({ id });
        if (!user) throw new Error("User not found");
        return await repo.remove(user);
    }

    // Ajouter un utilisateur à une famille
    async addUserToFamille(idUser: number, idFamille: number) {
        const userRepo = this.db.getRepository(User);
        const familleRepo = this.db.getRepository(Famille);

        const user = await userRepo.findOneBy({ id: idUser });
        const famille = await familleRepo.findOneBy({ idFamille });

        if (!user || !famille) throw new Error("User or Famille not found");

        user.famille = famille;
        return await userRepo.save(user);
    }

    // Obtenir le solde de points d'un utilisateur
    async getUserCoins(idUser: number) {
        const user = await this.getUserById(idUser);
        if (!user ) throw new Error("User  not found");
        return user.coins;
    }

    // Ajouter des points à un utilisateur
    async addCoinsToUser(idUser: number, amount: number, reason: string) {
        const userRepo = this.db.getRepository(User);
        const transactionRepo = this.db.getRepository(TransactionCoins);

        const user = await userRepo.findOneBy({ id: idUser });
        if (!user) throw new Error("User not found");

        user.coins += amount;
        await userRepo.save(user);

        // Enregistrer la transaction
        const transaction = transactionRepo.create({
            user: user,
            type: "Gain",
            montant: amount,
            description: reason,
        });
        await transactionRepo.save(transaction);

        return user.coins;
    }

  
    async listUsers() {
        const repo = this.db.getRepository(User);
        const users = await repo.find({
            relations: {
                famille:true,
                chats:true 
            },
        });
        return users;
    }
    async verifUser(userId: number): Promise<boolean> {
        const repo = this.db.getRepository(User);

        // Recherche de l'utilisateur par ID
        const user = await repo.findOneBy({ id: userId });

        return !!user; // Retourne true si l'utilisateur existe, sinon false
    }
    async getOneUser(userId: number): Promise<User | null> {
        const repo = this.db.getRepository(User);

        // Recherche de l'utilisateur par ID
        const user = await repo.findOneBy({ id: userId });

        return user;
    }

        async deleteToken(id: number): Promise<DeleteResult> {

        const TokenDelete = await this.db.createQueryBuilder().delete().from(Token).where("userId = :id", { id: id }).execute();

        return TokenDelete;

    }


}