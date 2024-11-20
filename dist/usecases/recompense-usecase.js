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
class RecompenseUsecase {
    constructor(db) {
        this.db = db;
    }
    // Create a new reward
    createRecompense(recompenseData) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.db.getRepository(recompense_1.Recompense);
            const recompense = repo.create(recompenseData);
            return yield repo.save(recompense);
        });
    }
    // Get all rewards for a user
    listRecompenses() {
        return __awaiter(this, arguments, void 0, function* (page = 1, limit = 10, idUser) {
            const repo = this.db.getRepository(recompense_1.Recompense);
            const query = repo.createQueryBuilder("recompense");
            if (idUser) {
                query.where("recompense.idUser LIKE :idUser", { idUser: `%${idUser}%` });
            }
            query.skip((page - 1) * limit).take(limit);
            return query.getMany();
        });
    }
}
exports.RecompenseUsecase = RecompenseUsecase;
