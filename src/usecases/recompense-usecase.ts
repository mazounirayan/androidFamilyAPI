import { DataSource } from "typeorm";
import { Recompense } from "../database/entities/recompense";
import { User } from "../database/entities/user";
import { TransactionCoins } from "../database/entities/transactionCoins";

export class RecompenseUsecase {
    constructor(private readonly db: DataSource) {}

    // Créer une récompense
    async createRecompense(recompenseData: Partial<Recompense>) {
        const repo = this.db.getRepository(Recompense);
        const recompense = repo.create(recompenseData);
        return await repo.save(recompense);
    }

    // Acheter une récompense
    async buyRecompense(idUser: number, idRecompense: number) {
        const userRepo = this.db.getRepository(User);
        const recompenseRepo = this.db.getRepository(Recompense);
        const transactionRepo = this.db.getRepository(TransactionCoins);

        const user = await userRepo.findOneBy({ id: idUser });
        const recompense = await recompenseRepo.findOneBy({  idRecompense });

        if (!user || !recompense) throw new Error("User or Recompense not found");

        if (user.coins < recompense.cout) throw new Error("Not enough coins");

        user.coins -= recompense.cout;
        recompense.stock -= 1;

        await userRepo.save(user);
        await recompenseRepo.save(recompense);

        // Enregistrer la transaction
        const transaction = transactionRepo.create({
            user: { id: idUser }, // Utilisez la relation `user` avec une référence à l'utilisateur
            type: "Depense",
            montant: recompense.cout,
            description: `Achat de la récompense : ${recompense.nom}`,
        });
        await transactionRepo.save(transaction);

        return recompense;
    }

    // Lister toutes les récompenses disponibles
    async listAvailableRecompenses() {
        const repo = this.db.getRepository(Recompense);
        return await repo.find({ where: { estDisponible: true } });
    }

    // Lister les récompenses avec pagination
    async listRecompenses(options: { page: number; limit: number }) {
        const repo = this.db.getRepository(Recompense);
        const [recompenses, total] = await repo.findAndCount({
            skip: (options.page - 1) * options.limit,
            take: options.limit,
        });
        return { recompenses, total, page: options.page, limit: options.limit };
    }

    // Récupérer une récompense par son ID
    async getRecompenseById(idRecompense: number) {
        const repo = this.db.getRepository(Recompense);
        return await repo.findOneBy({ idRecompense });
    }

    // Supprimer une récompense
    async deleteRecompense(idRecompense: number) {
        const repo = this.db.getRepository(Recompense);
        const recompense = await repo.findOneBy({ idRecompense });
        if (!recompense) throw new Error("Recompense not found");
        await repo.remove(recompense);
    }

    // Mettre à jour une récompense
    async updateRecompense(idRecompense: number, recompenseData: Partial<Recompense>) {
        const repo = this.db.getRepository(Recompense);
        const recompense = await repo.findOneBy({ idRecompense });
        if (!recompense) throw new Error("Recompense not found");
        Object.assign(recompense, recompenseData);
        return await repo.save(recompense);
    }
}