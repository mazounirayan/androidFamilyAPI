import { DataSource } from "typeorm";
import { Recompense } from "../database/entities/recompense";
import { User } from "../database/entities/user";
import { TransactionCoins } from "../database/entities/transactionCoins";
import { UserRecompense } from "../database/entities/userRecompense";
import { FamilleRecompense } from "../database/entities/familleRecompense";
import { Famille } from "../database/entities/famille";

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
    async getRecompensesByFamille(idFamille: number) {
        const repo = this.db.getRepository(FamilleRecompense);
    
        const results = await repo.find({
            where: { idFamille }, // Use the correct column name
            relations: ['famille', 'recompense'],
        });
    
        return results.map(({ recompense }) => recompense);
    }

    async createRecompenseForFamille(
        idFamille: number,
        recompenseData: Partial<Recompense>
    ) {
        const familleRepository = this.db.getRepository(Famille);
        const recompenseRepository = this.db.getRepository(Recompense);
        const familleRecompenseRepository = this.db.getRepository(FamilleRecompense);

        const famille = await familleRepository.findOneBy({ idFamille });
        if (!famille) {
            throw new Error("Famille introuvable.");
        }
        const recompense = recompenseRepository.create(recompenseData);
       
      
        const savedRecompense = await recompenseRepository.save(recompense);

        const familleRecompense = familleRecompenseRepository.create({
            famille,
            recompense: savedRecompense,

        });

        return await familleRecompenseRepository.save(familleRecompense);
  
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


    async listRecompensesByUserId(idUser: number): Promise<Recompense[]> {
        const repo = this.db.getRepository(UserRecompense);
        
        const userRecompenses = await repo.find({
            where: { idUser: idUser }, // Utilisez directement idUser, pas un objet
            relations: ['recompense'], // Charger la relation "recompense"
        });
    
      
        const recompenses = userRecompenses.map(ur => ur.recompense);
    
      
    
        return recompenses;
    }
  
}