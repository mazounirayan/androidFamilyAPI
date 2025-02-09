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
exports.UserUsecase = void 0;
const user_1 = require("../database/entities/user");
const famille_1 = require("../database/entities/famille");
const transactionCoins_1 = require("../database/entities/transactionCoins");
const token_1 = require("../database/entities/token");
class UserUsecase {
    constructor(db) {
        this.db = db;
    }
    // Créer un utilisateur
    createUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.db.getRepository(user_1.User);
            const user = repo.create(userData);
            return yield repo.save(user);
        });
    }
    getUserByToken(tokenValue) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenRepo = this.db.getRepository(token_1.Token);
            const token = yield tokenRepo.findOne({
                where: { token: tokenValue },
                relations: {
                    user: {
                        chats: true,
                    },
                },
            });
            if (!token) {
                throw new Error('Token invalide ou inexistant');
            }
            return token.user;
        });
    }
    // Obtenir un utilisateur par son ID
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.db.getRepository(user_1.User);
            return yield repo.findOneBy({ id });
        });
    }
    // Mettre à jour un utilisateur
    updateUser(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.db.getRepository(user_1.User);
            const user = yield repo.findOneBy({ id });
            if (!user)
                throw new Error("User not found");
            Object.assign(user, updateData);
            return yield repo.save(user);
        });
    }
    // Supprimer un utilisateur
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.db.getRepository(user_1.User);
            const user = yield repo.findOneBy({ id });
            if (!user)
                throw new Error("User not found");
            return yield repo.remove(user);
        });
    }
    // Ajouter un utilisateur à une famille
    addUserToFamille(idUser, idFamille) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepo = this.db.getRepository(user_1.User);
            const familleRepo = this.db.getRepository(famille_1.Famille);
            const user = yield userRepo.findOneBy({ id: idUser });
            const famille = yield familleRepo.findOneBy({ idFamille });
            if (!user || !famille)
                throw new Error("User or Famille not found");
            user.famille = famille;
            return yield userRepo.save(user);
        });
    }
    // Obtenir le solde de points d'un utilisateur
    getUserCoins(idUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.getUserById(idUser);
            if (!user)
                throw new Error("User  not found");
            return user.coins;
        });
    }
    // Ajouter des points à un utilisateur
    addCoinsToUser(idUser, amount, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepo = this.db.getRepository(user_1.User);
            const transactionRepo = this.db.getRepository(transactionCoins_1.TransactionCoins);
            const user = yield userRepo.findOneBy({ id: idUser });
            if (!user)
                throw new Error("User not found");
            user.coins += amount;
            yield userRepo.save(user);
            // Enregistrer la transaction
            const transaction = transactionRepo.create({
                user: user,
                type: "Gain",
                montant: amount,
                description: reason,
            });
            yield transactionRepo.save(transaction);
            return user.coins;
        });
    }
    listUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.db.getRepository(user_1.User);
            const users = yield repo.find({
                relations: {
                    famille: true,
                    chats: true
                },
            });
            return users;
        });
    }
    verifUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.db.getRepository(user_1.User);
            // Recherche de l'utilisateur par ID
            const user = yield repo.findOneBy({ id: userId });
            return !!user; // Retourne true si l'utilisateur existe, sinon false
        });
    }
    getOneUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.db.getRepository(user_1.User);
            // Recherche de l'utilisateur par ID
            const user = yield repo.findOneBy({ id: userId });
            return user;
        });
    }
    deleteToken(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const TokenDelete = yield this.db.createQueryBuilder().delete().from(token_1.Token).where("userId = :id", { id: id }).execute();
            return TokenDelete;
        });
    }
}
exports.UserUsecase = UserUsecase;
