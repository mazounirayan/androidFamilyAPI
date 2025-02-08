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
const user_1 = require("../database/entities/user");
class FamilleUsecase {
    constructor(db) {
        this.db = db;
    }
    // Créer une famille
    createFamille(familleData) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.db.getRepository(famille_1.Famille);
            const famille = repo.create(familleData);
            return yield repo.save(famille);
        });
    }
    // FamilleUsecase.ts
    updateFamille(idFamille, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.db.getRepository(famille_1.Famille);
            // Find the famille by ID
            const famille = yield repo.findOneBy({ idFamille });
            if (!famille) {
                throw new Error("Famille not found");
            }
            // Update the famille with new data
            Object.assign(famille, updateData);
            // Save the updated famille
            return yield repo.save(famille);
        });
    }
    // Obtenir une famille par son ID
    getFamilleById(idFamille) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.db.getRepository(famille_1.Famille);
            const famille = yield repo.findOneBy({ idFamille });
            if (!famille)
                throw new Error("Famille not found");
            return famille;
        });
    }
    // Générer un code d'invitation pour une famille
    generateInvitationCode(idFamille) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.db.getRepository(famille_1.Famille);
            const famille = yield repo.findOneBy({ idFamille });
            if (!famille)
                throw new Error("Famille not found");
            const code = `FAM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
            famille.code_invitation = code;
            return yield repo.save(famille);
        });
    }
    // Obtenir tous les membres d'une famille
    getFamilyMembers(idFamille) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.db.getRepository(user_1.User);
            return yield repo.find({
                /*           relations: {
                               chats:true
                           },
               */ where: {
                    famille: { idFamille },
                },
            });
        });
    }
    deleteFamille(idFamille) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.db.getRepository(famille_1.Famille);
            const famille = yield repo.findOneBy({ idFamille });
            if (!famille) {
                throw new Error("Famille not found");
            }
            try {
                return yield repo.remove(famille);
            }
            catch (dbError) {
                throw new Error("Failed to delete famille");
            }
        });
    }
    listFamilles(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.db.getRepository(famille_1.Famille);
            const query = repo.createQueryBuilder('famille');
            if (options.nom) {
                query.where('famille.nom LIKE :nom', { nom: `%${options.nom}%` });
            }
            const [familles, total] = yield query
                .skip((options.page - 1) * options.limit)
                .take(options.limit)
                .getManyAndCount();
            return { familles, total, page: options.page, limit: options.limit };
        });
    }
}
exports.FamilleUsecase = FamilleUsecase;
