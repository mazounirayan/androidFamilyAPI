import { DataSource } from "typeorm";
import { TransactionCoins } from "../database/entities/transactionCoins";
import { User } from "../database/entities/user";

export class TransactionCoinsUsecase {
    constructor(private readonly db: DataSource) {}

    // Créer une transaction
    async createTransaction(transactionData: Partial<TransactionCoins>) {
        const repo = this.db.getRepository(TransactionCoins);
        const transaction = repo.create(transactionData);
        return await repo.save(transaction);
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

    // Obtenir l'historique des transactions d'un utilisateur
    async getUserTransactionHistory(idUser: number) {
        const repo = this.db.getRepository(TransactionCoins);
        return await repo.find({
            where: {
                user: { id: idUser },
            },
        });
    }

    // Lister les transactions avec pagination et filtres
    async listTransactions(options: { page: number; limit: number; idUser?: number; type?: string }) {
        const repo = this.db.getRepository(TransactionCoins);
        const query = repo.createQueryBuilder("transaction");

        if (options.idUser) {
            query.andWhere("transaction.user.id = :idUser", { idUser: options.idUser });
        }
        if (options.type) {
            query.andWhere("transaction.type = :type", { type: options.type });
        }

        const [transactions, total] = await query
            .skip((options.page - 1) * options.limit)
            .take(options.limit)
            .getManyAndCount();

        return { transactions, total, page: options.page, limit: options.limit };
    }

    // Obtenir une transaction par son ID
    async getTransactionById(idTransaction: number) {
        const repo = this.db.getRepository(TransactionCoins);
        return await repo.findOneBy({  idTransaction });
    }

    // Supprimer une transaction
    async deleteTransaction(idTransaction: number) {
        const repo = this.db.getRepository(TransactionCoins);
        const transaction = await repo.findOneBy({  idTransaction });
        if (!transaction) throw new Error("Transaction not found");
        return await repo.remove(transaction);
    }

    // Mettre à jour une transaction
    async updateTransaction(idTransaction: number, updateData: Partial<TransactionCoins>) {
        const repo = this.db.getRepository(TransactionCoins);
        const transaction = await repo.findOneBy({  idTransaction });
        if (!transaction) throw new Error("Transaction not found");
        Object.assign(transaction, updateData);
        return await repo.save(transaction);
    }
}