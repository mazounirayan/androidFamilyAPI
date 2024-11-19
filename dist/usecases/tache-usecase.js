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
exports.TacheUsecase = void 0;
const tache_1 = require("../database/entities/tache");
const user_1 = require("../database/entities/user");
const famille_1 = require("../database/entities/famille");
class TacheUsecase {
    constructor(db) {
        this.db = db;
    }
    verifTache(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.getTacheById(id);
            if (!user) {
                return false;
            }
            return true;
        });
    }
    // Mettre à jour une tâche
    updateTache(idTache, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            const tacheRepo = this.db.getRepository(tache_1.Tache);
            const tache = yield tacheRepo.findOneBy({ idTache });
            if (!tache) {
                throw new Error(`Tache with id ${idTache} not found`);
            }
            if (tache.date_debut === undefined && tache.date_fin === undefined && tache.description === undefined && tache.famille === undefined && tache.nom === undefined && tache.status === undefined && tache.type === undefined && tache.user === undefined && tache.idTache === undefined) {
                return "No changes";
            }
            const userRepo = this.db.getRepository(user_1.User);
            const familleRepo = this.db.getRepository(famille_1.Famille);
            if (updates.user && updates.user.id) {
                updates.user = (yield userRepo.findOneBy({ id: updates.user.id })) || undefined;
            }
            if (updates.famille && updates.famille.idFamille) {
                updates.famille = (yield familleRepo.findOneBy({ idFamille: updates.famille.idFamille })) || undefined;
            }
            Object.assign(tache, updates);
            return tacheRepo.save(tache);
        });
    }
    // Obtenir une tâche par ID
    getTacheById(idTache) {
        return __awaiter(this, void 0, void 0, function* () {
            const tacheRepo = this.db.getRepository(tache_1.Tache);
            return tacheRepo.findOne({
                where: { idTache },
                relations: ["user", "famille"],
            });
        });
    }
    // Lister les tâches avec pagination et filtres
    listTaches(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const tacheRepo = this.db.getRepository(tache_1.Tache);
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
            const [data, total] = yield query.getManyAndCount();
            return { data, total };
        });
    }
    // Supprimer une tâche
    deleteTache(idTache) {
        return __awaiter(this, void 0, void 0, function* () {
            const tacheRepo = this.db.getRepository(tache_1.Tache);
            const tache = yield tacheRepo.findOneBy({ idTache });
            if (!tache) {
                throw new Error(`Tache with id ${idTache} not found`);
            }
            yield tacheRepo.remove(tache);
        });
    }
}
exports.TacheUsecase = TacheUsecase;
