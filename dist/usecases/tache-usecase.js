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
const transactionCoins_1 = require("../database/entities/transactionCoins");
class TacheUsecase {
    constructor(db) {
        this.db = db;
    }
    // Créer une tâche
    createTache(tacheData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const repo = this.db.getRepository(tache_1.Tache);
                const tache = repo.create(tacheData);
                return yield repo.save(tache);
            }
            catch (error) {
                console.error('Erreur dans TacheUsecase.createTache:', error);
                throw error;
            }
        });
    }
    // Marquer une tâche comme terminée
    markTacheAsCompleted(idTache) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.db.getRepository(tache_1.Tache);
            const tache = yield repo.findOneBy({ idTache });
            if (!tache)
                return null; // Return null if task is not found
            tache.status = "Completed";
            yield repo.save(tache);
            // Ajouter des points à l'utilisateur
            const userRepo = this.db.getRepository(user_1.User);
            const user = yield userRepo.findOneBy({ id: tache.user.id });
            if (!user)
                throw new Error("User not found");
            user.coins += 10; // Exemple : 10 points pour une tâche terminée
            yield userRepo.save(user);
            // Enregistrer la transaction
            const transactionRepo = this.db.getRepository(transactionCoins_1.TransactionCoins);
            const transaction = transactionRepo.create({
                user: tache.user,
                type: "Gain",
                montant: 10,
                description: `Tâche terminée : ${tache.nom}`,
            });
            yield transactionRepo.save(transaction);
            return tache;
        });
    }
    // Lister les tâches d'un utilisateur
    listTachesByUser(idUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.db.getRepository(tache_1.Tache);
            return yield repo.find({ where: { user: { id: idUser } } });
        });
    }
    // Supprimer une tâche
    deleteTache(idTache) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.db.getRepository(tache_1.Tache);
            const tache = yield repo.findOneBy({ idTache });
            if (!tache)
                throw new Error("Tache not found");
            return yield repo.remove(tache);
        });
    }
    // Mettre à jour une tâche
    updateTache(idTache, tacheData) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.db.getRepository(tache_1.Tache);
            const tache = yield repo.findOneBy({ idTache });
            if (!tache)
                throw new Error("Tâche non trouvée");
            Object.assign(tache, tacheData);
            return yield repo.save(tache);
        });
    }
    listTachesByUserId(idUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.db.getRepository(tache_1.Tache);
            const taches = yield repo.find({ where: { user: { id: idUser } } });
            return taches;
        });
    }
    assignTacheToUser(tacheId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.db.getRepository(tache_1.Tache);
            const Userrepo = this.db.getRepository(user_1.User);
            const tache = yield repo.findOneBy({ idTache: tacheId });
            if (!tache) {
                throw new Error("Task not found");
            }
            const user = yield Userrepo.findOneBy({ id: userId });
            if (!user) {
                throw new Error("user not found");
            }
            tache.user = user;
            yield repo.save(tache);
        });
    }
    listTachesByFamilleId(familleId) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.db.getRepository(tache_1.Tache);
            const taches = yield repo.find({ where: { famille: { idFamille: familleId }
                },
                relations: ['user']
            });
            return taches;
        });
    }
    // Lister les tâches avec pagination et filtres
    listTaches() {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.db.getRepository(tache_1.Tache);
            const users = yield repo.find({
                relations: ['famille', 'user']
            });
            return users;
        });
    }
    // Obtenir une tâche par son ID
    getTacheById(idTache) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.db.getRepository(tache_1.Tache);
            return yield repo.findOneBy({ idTache });
        });
    }
}
exports.TacheUsecase = TacheUsecase;
