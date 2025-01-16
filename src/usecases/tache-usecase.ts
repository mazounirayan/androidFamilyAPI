import { DataSource } from "typeorm";
import { Tache } from "../database/entities/tache";
import { User } from "../database/entities/user";
import { TransactionCoins } from "../database/entities/transactionCoins";

export class TacheUsecase {
    constructor(private readonly db: DataSource) {}

    // Créer une tâche
    async createTache(tacheData: Partial<Tache>) {
        const repo = this.db.getRepository(Tache);
        const tache = repo.create(tacheData);
        return await repo.save(tache);
    }

    // Marquer une tâche comme terminée
    async markTacheAsCompleted(idTache: number) {
        const repo = this.db.getRepository(Tache);
        const tache = await repo.findOneBy({ idTache });
        if (!tache) return null; // Return null if task is not found

        tache.status = "Completed";
        await repo.save(tache);

        // Ajouter des points à l'utilisateur
        const userRepo = this.db.getRepository(User);
        const user = await userRepo.findOneBy({ id: tache.user.id });
        if (!user) throw new Error("User not found");

        user.coins += 10; // Exemple : 10 points pour une tâche terminée
        await userRepo.save(user);

        // Enregistrer la transaction
        const transactionRepo = this.db.getRepository(TransactionCoins);
        const transaction = transactionRepo.create({
            user: tache.user,
            type: "Gain",
            montant: 10,
            description: `Tâche terminée : ${tache.nom}`,
        });
        await transactionRepo.save(transaction);

        return tache;
    }

    // Lister les tâches d'un utilisateur
    async listTachesByUser(idUser: number) {
        const repo = this.db.getRepository(Tache);
        return await repo.find({ where: { user: { id: idUser } } });
    }

    // Supprimer une tâche
    async deleteTache(idTache: number) {
        const repo = this.db.getRepository(Tache);
        const tache = await repo.findOneBy({ idTache });
        if (!tache) throw new Error("Tache not found");
        return await repo.remove(tache);
    }

    // Mettre à jour une tâche
    async updateTache(idTache: number, tacheData: Partial<Tache>) {
        const repo = this.db.getRepository(Tache);
        const tache = await repo.findOneBy({ idTache });
        if (!tache) throw new Error("Tâche non trouvée");
        Object.assign(tache, tacheData);
        return await repo.save(tache);
    }
    async listTachesByUserId(idUser: number): Promise<Tache[]> {
        const repo = this.db.getRepository(Tache);
        const taches = await repo.find({ where: { user: { id: idUser } } });
    
   
        return taches;
    }
    async assignTacheToUser(tacheId: number, userId: number): Promise<void> {
        const repo = this.db.getRepository(Tache);
        const Userrepo = this.db.getRepository(User);
        const tache = await repo.findOneBy({ idTache: tacheId });

       
        if (!tache) {
            throw new Error("Task not found");
        }
        const user = await Userrepo.findOneBy({ id:userId  });
        if (!user) {
            throw new Error("user not found");
        }
        tache.user = user;
        await repo.save(tache);
    }
    async listTachesByFamilleId(familleId: number): Promise<Tache[]> {
        const repo = this.db.getRepository(Tache);
        const taches = await repo.find({ where:   { famille: { idFamille: familleId }}});
    
  
    
        return taches;
    }
    // Lister les tâches avec pagination et filtres
    async listTaches(options: { page: number; limit: number; status?: string; type?: string; idFamille?: number; nom?: string }) {
        const repo = this.db.getRepository(Tache);
        const query = repo.createQueryBuilder("tache");

        if (options.status) {
            query.andWhere("tache.status = :status", { status: options.status });
        }
        if (options.type) {
            query.andWhere("tache.type = :type", { type: options.type });
        }
        if (options.idFamille) {
            query.andWhere("tache.idFamille = :idFamille", { idFamille: options.idFamille });
        }
        if (options.nom) {
            query.andWhere("tache.nom LIKE :nom", { nom: `%${options.nom}%` });
        }

        const [taches, total] = await query
            .skip((options.page - 1) * options.limit)
            .take(options.limit)
            .getManyAndCount();

        return { taches, total, page: options.page, limit: options.limit };
    }

    // Obtenir une tâche par son ID
    async getTacheById(idTache: number) {
        const repo = this.db.getRepository(Tache);
        return await repo.findOneBy({ idTache });
    }
}