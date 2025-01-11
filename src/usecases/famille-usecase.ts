import { DataSource } from "typeorm";
import { Famille } from "../database/entities/famille";
import { User } from "../database/entities/user";

export class FamilleUsecase {
    constructor(private readonly db: DataSource) {}

    // Créer une famille
    async createFamille(familleData: Partial<Famille>) {
        const repo = this.db.getRepository(Famille);
        const famille = repo.create(familleData);
        return await repo.save(famille);
    }
// FamilleUsecase.ts
async updateFamille(idFamille: number, updateData: Partial<Famille>) {
    const repo = this.db.getRepository(Famille);

    // Find the famille by ID
    const famille = await repo.findOneBy({ idFamille });
    if (!famille) {
        throw new Error("Famille not found");
    }

    // Update the famille with new data
    Object.assign(famille, updateData);

    // Save the updated famille
    return await repo.save(famille);
}
    // Obtenir une famille par son ID
    async getFamilleById(idFamille: number) {
        const repo = this.db.getRepository(Famille);
        const famille = await repo.findOneBy({ idFamille });
        if (!famille) throw new Error("Famille not found");
        return famille;
    }


    // Générer un code d'invitation pour une famille
    async generateInvitationCode(idFamille: number) {
        const repo = this.db.getRepository(Famille);
        const famille = await repo.findOneBy({ idFamille });
        if (!famille) throw new Error("Famille not found");

        const code = `FAM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        famille.code_invitation = code;
        return await repo.save(famille);
    }

    // Obtenir tous les membres d'une famille
    async getFamilyMembers(idFamille: number) {
        const repo = this.db.getRepository(User);
        return await repo.find({
            where: {
                famille: { idFamille }, 
            },
        });
    }

 
async deleteFamille(idFamille: number) {
    const repo = this.db.getRepository(Famille);
    const famille = await repo.findOneBy({ idFamille });

    if (!famille) {
        throw new Error("Famille not found");
    }

    try {
        return await repo.remove(famille);
    } catch (dbError) {
        throw new Error("Failed to delete famille");
    }
}
async listFamilles(options: { page: number; limit: number; nom?: string }) {
    const repo = this.db.getRepository(Famille);
    const query = repo.createQueryBuilder('famille');

    if (options.nom) {
        query.where('famille.nom LIKE :nom', { nom: `%${options.nom}%` });
    }

    const [familles, total] = await query
        .skip((options.page - 1) * options.limit)
        .take(options.limit)
        .getManyAndCount();

    return { familles, total, page: options.page, limit: options.limit };
}
}