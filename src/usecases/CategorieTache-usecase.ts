import { DataSource } from "typeorm";
import { Tache } from "../database/entities/tache";
import { User } from "../database/entities/user";
import { TransactionCoins } from "../database/entities/transactionCoins";
import { CategorieTache } from "../database/entities/CategorieTache";

export class CategorieTacheUsecase {
    constructor(private readonly db: DataSource) {}


    async deleteCategorieTache(idCategorie: number): Promise<void> {
        const repo = this.db.getRepository(CategorieTache);
        const result = await repo.delete({ idCategorie });
    
        if (result.affected === 0) {
            throw new Error("Category not found");
        }
    }
    async updateCategorieTache(idCategorie: number, categorieData: Partial<CategorieTache>): Promise<CategorieTache> {
        const repo = this.db.getRepository(CategorieTache);
        const categorie = await repo.findOneBy({ idCategorie });
    
        if (!categorie) {
            throw new Error("Category not found");
        }
    
        Object.assign(categorie, categorieData);
        return await repo.save(categorie);
    }
    async getCategorieTacheById(idCategorie: number): Promise<CategorieTache | null> {
        const repo = this.db.getRepository(CategorieTache);
        const categorie = await repo.findOneBy({ idCategorie });
    
        if (!categorie) {
            throw new Error("Category not found");
        }
    
        return categorie;
    }
    async createCategorieTache(categorieData: Partial<CategorieTache>): Promise<CategorieTache> {
        const repo = this.db.getRepository(CategorieTache);
        const categorie = repo.create(categorieData);
        return await repo.save(categorie);
    }
    async listCategoriesTache(): Promise<CategorieTache[]> {
        const repo = this.db.getRepository(CategorieTache);
        const categories = await repo.find();
    
        if (!categories || categories.length === 0) {
            throw new Error("No categories found");
        }
    
        return categories;
    }
}