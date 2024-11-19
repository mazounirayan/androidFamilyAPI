"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FamilleUsecase = void 0;
const famille_1 = require("../database/entities/famille");
const famille_validator_1 = require("../validators/famille-validator"); // Importation des validations
class FamilleUsecase {
    constructor(db) {
        this.db = db;
    }
    // Méthode pour créer une famille
    createFamille(nom) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validation des données d'entrée
            const { error } = famille_validator_1.createFamilleValidation.validate({ nom });
            if (error) {
                throw new Error(error.details.map(detail => detail.message).join(", "));
            }
            const familleRepo = this.db.getRepository(famille_1.Famille);
            const famille = familleRepo.create({ nom, date_de_creation: new Date() });
            return familleRepo.save(famille);
        });
    }
    // Méthode pour récupérer une famille par son ID
    getFamilleById(idFamille) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validation de l'ID
            const { error } = famille_validator_1.FamilleIdValidation.validate({ id: idFamille });
            if (error) {
                throw new Error(error.details.map(detail => detail.message).join(", "));
            }
            const familleRepo = this.db.getRepository(famille_1.Famille);
            return familleRepo.findOneBy({ idFamille });
        });
    }
    // Méthode pour lister toutes les familles
    listFamilles() {
        return __awaiter(this, arguments, void 0, function* (page = 1, limit = 10, nom) {
            const familleRepo = this.db.getRepository(famille_1.Famille);
            const query = familleRepo.createQueryBuilder("famille");
            if (nom) {
                query.where("famille.nom LIKE :nom", { nom: `%${nom}%` });
            }
            query.skip((page - 1) * limit).take(limit);
            return query.getMany();
        });
    }
    // Méthode pour supprimer une famille
    deleteFamille(idFamille) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validation de l'ID
            const { error } = famille_validator_1.FamilleIdValidation.validate({ id: idFamille });
            if (error) {
                throw new Error(error.details.map(detail => detail.message).join(", "));
            }
            const familleRepo = this.db.getRepository(famille_1.Famille);
            const famille = yield familleRepo.findOneBy({ idFamille });
            if (famille) {
                yield familleRepo.remove(famille);
            }
            else {
                throw new Error("Famille not found");
            }
        });
    }
    // Méthode pour mettre à jour une famille
    updateFamille(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validation des données d'entrée
            const { error } = famille_validator_1.updateFamilleValidation.validate(data);
            if (error) {
                throw new Error(error.details.map(detail => detail.message).join(", "));
            }
            const { id, nom } = data;
            const familleRepo = this.db.getRepository(famille_1.Famille);
            // Vérifier si la famille existe
            const famille = yield familleRepo.findOneBy({ idFamille: id });
            if (!famille) {
                throw new Error("Famille not found");
            }
            // Mettre à jour les champs modifiables
            if (nom)
                famille.nom = nom;
            return familleRepo.save(famille);
        });
    }
}
exports.FamilleUsecase = FamilleUsecase;
