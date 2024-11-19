import { DataSource } from "typeorm";
import { Tache } from "../database/entities/tache";
import { User } from "../database/entities/user";
import { Famille } from "../database/entities/famille";

export class TacheUsecase {
    constructor(private readonly db: DataSource) {}

    async verifTache(id: number): Promise<boolean> { 
        const user = await this.getTacheById(id);
        if (!user) {
            return false;
        }
    
    
        return true;
    }
   
    // Mettre à jour une tâche
    async updateTache(idTache: number, updates: Partial<Tache>): Promise<Tache | string |null> {
        const tacheRepo = this.db.getRepository(Tache);

        const tache = await tacheRepo.findOneBy({ idTache });
        if (!tache) {
            throw new Error(`Tache with id ${idTache} not found`);
        }
        if (tache.date_debut === undefined &&tache.date_fin === undefined &&tache.description === undefined &&tache.famille === undefined && tache.nom === undefined &&tache.status === undefined && tache.type === undefined && tache.user === undefined && tache.idTache === undefined  ) {
            return "No changes";
        }
        const userRepo = this.db.getRepository(User);
        const familleRepo = this.db.getRepository(Famille);

        if (updates.user && updates.user.id) {
            updates.user = await userRepo.findOneBy({ id: updates.user.id }) || undefined;
        }

        if (updates.famille && updates.famille.idFamille) {
            updates.famille = await familleRepo.findOneBy({ idFamille: updates.famille.idFamille }) || undefined;
        }

        Object.assign(tache, updates);
        return tacheRepo.save(tache);
    }

    // Obtenir une tâche par ID
    async getTacheById(idTache: number): Promise<Tache | null> {
        const tacheRepo = this.db.getRepository(Tache);
        return tacheRepo.findOne({
            where: { idTache },
            relations: ["user", "famille"],
        });
    }

    // Lister les tâches avec pagination et filtres
    async listTaches(filters: {
        page?: number;
        limit?: number;
        status?: string;
        type?: string;
        idFamille?: number;
        idTache?: number;
        nom?: string;
    }): Promise<{ data: Tache[]; total: number }> {
        const tacheRepo = this.db.getRepository(Tache);

        const query = tacheRepo.createQueryBuilder("tache")
            .leftJoinAndSelect("tache.user", "user")
            .leftJoinAndSelect("tache.famille", "famille");

        if (filters.status) {
            query.andWhere("tache.status = :status", { status: filters.status });
        }

        if (filters.type) {
            query.andWhere("tache.type = :type", { type: filters.type });
        }

        if (filters.idFamille) {
            query.andWhere("tache.famille.idFamille = :idFamille", { idFamille: filters.idFamille });
        }

        if (filters.nom) {
            query.andWhere("tache.nom LIKE :nom", { nom: `%${filters.nom}%` });
        }

        const page = filters.page || 1;
        const limit = filters.limit || 10;
        query.skip((page - 1) * limit).take(limit);

        const [data, total] = await query.getManyAndCount();

        return { data, total };
    }

    // Supprimer une tâche
    async deleteTache(idTache: number): Promise<void> {
        const tacheRepo = this.db.getRepository(Tache);
        const tache = await tacheRepo.findOneBy({ idTache });

        if (!tache) {
            throw new Error(`Tache with id ${idTache} not found`);
        }

        await tacheRepo.remove(tache);
    }
}
