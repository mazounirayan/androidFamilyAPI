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
exports.TransactionCoinsUsecase = void 0;
const transactionCoins_1 = require("../database/entities/transactionCoins");
const user_1 = require("../database/entities/user");
class TransactionCoinsUsecase {
    constructor(db) {
        this.db = db;
    }
    // Créer une transaction
    createTransaction(transactionData) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.db.getRepository(transactionCoins_1.TransactionCoins);
            const transaction = repo.create(transactionData);
            return yield repo.save(transaction);
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
    // Obtenir l'historique des transactions d'un utilisateur
    getUserTransactionHistory(idUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.db.getRepository(transactionCoins_1.TransactionCoins);
            return yield repo.find({
                where: {
                    user: { id: idUser },
                },
            });
        });
    }
    listTransactionsByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.db.getRepository(transactionCoins_1.TransactionCoins);
            const transactions = yield repo.find({ where: { user: { id: userId } } });
            if (!transactions || transactions.length === 0) {
                throw new Error("No transactions found for this user");
            }
            return transactions;
        });
    }
    // Lister les transactions avec pagination et filtres
    listTransactions(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.db.getRepository(transactionCoins_1.TransactionCoins);
            const query = repo.createQueryBuilder("transaction");
            if (options.idUser) {
                query.andWhere("transaction.user.id = :idUser", { idUser: options.idUser });
            }
            if (options.type) {
                query.andWhere("transaction.type = :type", { type: options.type });
            }
            const [transactions, total] = yield query
                .skip((options.page - 1) * options.limit)
                .take(options.limit)
                .getManyAndCount();
            return { transactions, total, page: options.page, limit: options.limit };
        });
    }
    // Obtenir une transaction par son ID
    getTransactionById(idTransaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.db.getRepository(transactionCoins_1.TransactionCoins);
            return yield repo.findOneBy({ idTransaction });
        });
    }
    // Supprimer une transaction
    deleteTransaction(idTransaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.db.getRepository(transactionCoins_1.TransactionCoins);
            const transaction = yield repo.findOneBy({ idTransaction });
            if (!transaction)
                throw new Error("Transaction not found");
            return yield repo.remove(transaction);
        });
    }
    // Mettre à jour une transaction
    updateTransaction(idTransaction, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.db.getRepository(transactionCoins_1.TransactionCoins);
            const transaction = yield repo.findOneBy({ idTransaction });
            if (!transaction)
                throw new Error("Transaction not found");
            Object.assign(transaction, updateData);
            return yield repo.save(transaction);
        });
    }
}
exports.TransactionCoinsUsecase = TransactionCoinsUsecase;
