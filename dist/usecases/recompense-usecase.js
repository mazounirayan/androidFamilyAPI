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
exports.RecompenseUsecase = void 0;
const recompense_1 = require("../database/entities/recompense");
const user_1 = require("../database/entities/user");
const transactionCoins_1 = require("../database/entities/transactionCoins");
const userRecompense_1 = require("../database/entities/userRecompense");
class RecompenseUsecase {
    constructor(db) {
        this.db = db;
    }
    // Créer une récompense
    createRecompense(recompenseData) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.db.getRepository(recompense_1.Recompense);
            const recompense = repo.create(recompenseData);
            return yield repo.save(recompense);
        });
    }
    // Acheter une récompense
    buyRecompense(idUser, idRecompense) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepo = this.db.getRepository(user_1.User);
            const recompenseRepo = this.db.getRepository(recompense_1.Recompense);
            const transactionRepo = this.db.getRepository(transactionCoins_1.TransactionCoins);
            const user = yield userRepo.findOneBy({ id: idUser });
            const recompense = yield recompenseRepo.findOneBy({ idRecompense });
            if (!user || !recompense)
                throw new Error("User or Recompense not found");
            if (user.coins < recompense.cout)
                throw new Error("Not enough coins");
            user.coins -= recompense.cout;
            recompense.stock -= 1;
            yield userRepo.save(user);
            yield recompenseRepo.save(recompense);
            // Enregistrer la transaction
            const transaction = transactionRepo.create({
                user: { id: idUser }, // Utilisez la relation `user` avec une référence à l'utilisateur
                type: "Depense",
                montant: recompense.cout,
                description: `Achat de la récompense : ${recompense.nom}`,
            });
            yield transactionRepo.save(transaction);
            return recompense;
        });
    }
    // Lister toutes les récompenses disponibles
    listAvailableRecompenses() {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.db.getRepository(recompense_1.Recompense);
            return yield repo.find({ where: { estDisponible: true } });
        });
    }
    // Lister les récompenses avec pagination
    listRecompenses(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.db.getRepository(recompense_1.Recompense);
            const [recompenses, total] = yield repo.findAndCount({
                skip: (options.page - 1) * options.limit,
                take: options.limit,
            });
            return { recompenses, total, page: options.page, limit: options.limit };
        });
    }
    // Récupérer une récompense par son ID
    getRecompenseById(idRecompense) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.db.getRepository(recompense_1.Recompense);
            return yield repo.findOneBy({ idRecompense });
        });
    }
    // Supprimer une récompense
    deleteRecompense(idRecompense) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.db.getRepository(recompense_1.Recompense);
            const recompense = yield repo.findOneBy({ idRecompense });
            if (!recompense)
                throw new Error("Recompense not found");
            yield repo.remove(recompense);
        });
    }
    // Mettre à jour une récompense
    updateRecompense(idRecompense, recompenseData) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.db.getRepository(recompense_1.Recompense);
            const recompense = yield repo.findOneBy({ idRecompense });
            if (!recompense)
                throw new Error("Recompense not found");
            Object.assign(recompense, recompenseData);
            return yield repo.save(recompense);
        });
    }
    listRecompensesByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.db.getRepository(userRecompense_1.UserRecompense);
            const userRecompenses = yield repo.find({
                where: { idUser: userId },
                relations: ["recompense"],
            });
            if (!userRecompenses || userRecompenses.length === 0) {
                throw new Error("No rewards found for this user");
            }
            return userRecompenses.map(ur => ur.recompense);
        });
    }
}
exports.RecompenseUsecase = RecompenseUsecase;
