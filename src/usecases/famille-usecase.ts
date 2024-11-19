import { DataSource } from "typeorm";
import { Famille } from "../database/entities/famille";
import { 
    createFamilleValidation, 
    updateFamilleValidation, 
    FamilleIdValidation, 
    UpdateFamilleRequest
} from "../validators/famille-validator"; // Importation des validations

export class FamilleUsecase {
    constructor(private readonly db: DataSource) {}

    // Méthode pour créer une famille
    async createFamille(nom: string): Promise<Famille> {
        // Validation des données d'entrée
        const { error } = createFamilleValidation.validate({ nom });
        if (error) {
            throw new Error(error.details.map(detail => detail.message).join(", "));
        }

        const familleRepo = this.db.getRepository(Famille);
        const famille = familleRepo.create({ nom, date_de_creation: new Date() });
        return familleRepo.save(famille);
    }

    // Méthode pour récupérer une famille par son ID
    async getFamilleById(idFamille: number): Promise<Famille | null> {
        // Validation de l'ID
        const { error } = FamilleIdValidation.validate({ id: idFamille });
        if (error) {
            throw new Error(error.details.map(detail => detail.message).join(", "));
        }

        const familleRepo = this.db.getRepository(Famille);
        return familleRepo.findOneBy({ idFamille });
    }

    // Méthode pour lister toutes les familles
    async listFamilles(page: number = 1, limit: number = 10, nom?: string): Promise<Famille[]> {
        const familleRepo = this.db.getRepository(Famille);
        const query = familleRepo.createQueryBuilder("famille");

        if (nom) {
            query.where("famille.nom LIKE :nom", { nom: `%${nom}%` });
        }

        query.skip((page - 1) * limit).take(limit);
        return query.getMany();
    }

    // Méthode pour supprimer une famille
    async deleteFamille(idFamille: number): Promise<void> {
        // Validation de l'ID
        const { error } = FamilleIdValidation.validate({ id: idFamille });
        if (error) {
            throw new Error(error.details.map(detail => detail.message).join(", "));
        }

        const familleRepo = this.db.getRepository(Famille);
        const famille = await familleRepo.findOneBy({ idFamille });

        if (famille) {
            await familleRepo.remove(famille);
        } else {
            throw new Error("Famille not found");
        }
    }

    // Méthode pour mettre à jour une famille
    async updateFamille(data: UpdateFamilleRequest): Promise<Famille> {
        // Validation des données d'entrée
        const { error } = updateFamilleValidation.validate(data);
        if (error) {
            throw new Error(error.details.map(detail => detail.message).join(", "));
        }

        const { id, nom } = data;
        const familleRepo = this.db.getRepository(Famille);

        // Vérifier si la famille existe
        const famille = await familleRepo.findOneBy({ idFamille: id });
        if (!famille) {
            throw new Error("Famille not found");
        }

        // Mettre à jour les champs modifiables
        if (nom) famille.nom = nom;

        return familleRepo.save(famille);
    }
}
