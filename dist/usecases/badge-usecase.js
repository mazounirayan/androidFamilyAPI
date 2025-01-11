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
exports.BadgeUsecase = void 0;
const Badge_1 = require("../database/entities/Badge");
const user_1 = require("../database/entities/user");
const userBadge_1 = require("../database/entities/userBadge");
class BadgeUsecase {
    constructor(db) {
        this.db = db;
    }
    createBadge(badgeData) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.db.getRepository(Badge_1.Badge);
            const badge = repo.create(badgeData);
            return yield repo.save(badge);
        });
    }
    // Lister les badges avec pagination
    listBadges(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.db.getRepository(Badge_1.Badge);
            const [badges, total] = yield repo.findAndCount({
                skip: (options.page - 1) * options.limit,
                take: options.limit,
            });
            return { badges, total, page: options.page, limit: options.limit };
        });
    }
    // Récupérer un badge par son ID
    getBadgeById(idBadge) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.db.getRepository(Badge_1.Badge);
            return yield repo.findOneBy({ idBadge }); // Correction ici
        });
    }
    // Supprimer un badge
    deleteBadge(idBadge) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.db.getRepository(Badge_1.Badge);
            const badge = yield repo.findOneBy({ idBadge });
            if (!badge)
                throw new Error("Badge not found");
            yield repo.remove(badge);
        });
    }
    // Mettre à jour un badge
    updateBadge(idBadge, badgeData) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.db.getRepository(Badge_1.Badge);
            const badge = yield repo.findOneBy({ idBadge });
            if (!badge)
                throw new Error("Badge not found");
            Object.assign(badge, badgeData);
            return yield repo.save(badge);
        });
    }
    // Attribuer un badge à un utilisateur
    assignBadgeToUser(idUser, idBadge) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepo = this.db.getRepository(user_1.User);
            const badgeRepo = this.db.getRepository(Badge_1.Badge);
            const userBadgeRepo = this.db.getRepository(userBadge_1.UserBadge);
            const user = yield userRepo.findOneBy({ id: idUser });
            const badge = yield badgeRepo.findOneBy({ idBadge });
            if (!user || !badge)
                throw new Error("User or Badge not found");
            // Vérifier si l'utilisateur a déjà ce badge
            const existingBadge = yield userBadgeRepo.findOne({ where: { idUser, idBadge } });
            if (existingBadge)
                throw new Error("User already has this badge");
            const userBadge = userBadgeRepo.create({ idUser, idBadge, date_obtention: new Date() });
            return yield userBadgeRepo.save(userBadge);
        });
    }
    // Lister les badges d'un utilisateur
    listUserBadges(idUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.db.getRepository(userBadge_1.UserBadge);
            return yield repo.find({ where: { idUser }, relations: ["badge"] });
        });
    }
    getBadgesByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.db.getRepository(Badge_1.Badge);
            const badges = yield repo
                .createQueryBuilder("badge")
                .innerJoin("badge.userBadges", "userBadge")
                .where("userBadge.idUser = :userId", { userId })
                .getMany();
            if (!badges || badges.length === 0) {
                throw new Error("No badges found for this user");
            }
            return badges;
        });
    }
    unassignBadgeFromUser(userId, badgeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.db.getRepository(userBadge_1.UserBadge);
            const result = yield repo
                .createQueryBuilder()
                .delete()
                .where("idUser = :userId AND idBadge = :badgeId", { userId, badgeId })
                .execute();
            if (result.affected === 0) {
                throw new Error("Badge assignment not found or already removed");
            }
        });
    }
}
exports.BadgeUsecase = BadgeUsecase;
