import { DataSource } from "typeorm";
import { User,UserRole } from "../database/entities/user";
import { Famille } from "../database/entities/famille";
import { TransactionCoins } from "../database/entities/transactionCoins";

export class UserUsecase {
    constructor(private readonly db: DataSource) {}

    // Créer un utilisateur
    async createUser(userData: Partial<User>) {
        const repo = this.db.getRepository(User);
        const user = repo.create(userData);
        return await repo.save(user);
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

    // Lister les utilisateurs avec pagination et filtres
    async listUsers(options: { page: number; limit: number; nom?: string; prenom?: string; email?: string; role?: UserRole }) {
        const repo = this.db.getRepository(User);
        const query = repo.createQueryBuilder("user");

        if (options.nom) {
            query.andWhere("user.nom LIKE :nom", { nom: `%${options.nom}%` });
        }
        if (options.prenom) {
            query.andWhere("user.prenom LIKE :prenom", { prenom: `%${options.prenom}%` });
        }
        if (options.email) {
            query.andWhere("user.email = :email", { email: options.email });
        }
        if (options.role) {
            query.andWhere("user.role = :role", { role: options.role });
        }

        const [users, total] = await query
            .skip((options.page - 1) * options.limit)
            .take(options.limit)
            .getManyAndCount();

        return { users, total, page: options.page, limit: options.limit };
    }
}