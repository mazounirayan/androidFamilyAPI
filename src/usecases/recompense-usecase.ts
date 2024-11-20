import { DataSource } from "typeorm";
import { Recompense } from "../database/entities/recompense";

export class RecompenseUsecase {
    constructor(private readonly db: DataSource) {}

    // Create a new reward
    async createRecompense(recompenseData: Partial<Recompense>) {
        const repo = this.db.getRepository(Recompense);
        const recompense = repo.create(recompenseData);
        return await repo.save(recompense);
    }

    // Get all rewards for a user
    async listRecompenses(page: number = 1, limit: number = 10,idUser?: number) {
        const repo = this.db.getRepository(Recompense);
        const query = repo.createQueryBuilder("recompense");
        if (idUser) {
            query.where("recompense.idUser LIKE :idUser", { idUser: `%${idUser}%` });
        }
        query.skip((page - 1) * limit).take(limit);
        return query.getMany();
    }
 
}
