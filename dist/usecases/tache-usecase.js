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
            var _a, _b;
            const repo = this.db.getRepository(tache_1.Tache);
            const tache = yield repo.findOne({
                where: { idTache },
                relations: ["user"] // Charge l'utilisateur actuel
            });
            if (!tache)
                throw new Error("Tâche non trouvée");
            console.log("Tâche actuelle :", tache);
            console.log("Nouvelle valeur :", tacheData);
            const ancienStatus = tache.status; // Statut actuel avant modification
            const nouveauStatus = tacheData.status; // Nouveau statut demandé
            // Vérifier si le statut change réellement
            if (nouveauStatus && nouveauStatus !== ancienStatus) {
                tacheData.ancien_status = ancienStatus; // Sauvegarder l'ancien statut
                const userRepo = this.db.getRepository(user_1.User);
                const user = yield userRepo.findOneBy({ id: tache.user.id });
                if (user) {
                    if (ancienStatus !== "FINI" && nouveauStatus === "FINI") {
                        // Passage vers "FINI" => Ajouter 30 coins
                        console.log("Ajout de 30 coins");
                        user.coins += 30;
                        yield userRepo.save(user);
                    }
                    else if (ancienStatus === "FINI" && (nouveauStatus === "EN_COURS" || nouveauStatus === "A_FAIRE")) {
                        // Passage de "FINI" vers "EN_COURS" ou "A_FAIRE" => Retirer 30 coins
                        console.log("Suppression de 30 coins");
                        user.coins -= 30;
                        yield userRepo.save(user);
                    }
                }
            }
            else {
                console.log("Le statut n'a pas changé, aucune modification de coins.");
            }
            // Vérifier si l'utilisateur change
            if ((_a = tacheData.user) === null || _a === void 0 ? void 0 : _a.id) {
                const userRepo = this.db.getRepository(user_1.User);
                const newUser = yield userRepo.findOneBy({ id: (_b = tacheData.user) === null || _b === void 0 ? void 0 : _b.id });
                if (!newUser)
                    throw new Error("Utilisateur non trouvé");
                tache.user = newUser;
            }
            Object.assign(tache, tacheData);
            console.log("Nouvelle tâche mise à jour :", tache);
            return yield repo.save(tache);
        });
    }
    listTachesByUserId(idUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.db.getRepository(tache_1.Tache);
            const taches = yield repo.find({ where: { user: { id: idUser } }, relations: ['user'] });
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
            const taches = yield repo.createQueryBuilder("tache")
                .leftJoin("tache.user", "user")
                .leftJoin("tache.famille", "famille")
                .where("famille.idFamille = :familleId", { familleId })
                .select([
                "tache.idTache AS idTache",
                "tache.nom AS nom",
                "tache.date_debut AS date_debut",
                "tache.date_fin AS date_fin",
                "tache.status AS status",
                "tache.type AS type",
                "tache.description AS description",
                "tache.priorite AS priorite",
                "user.id AS userId",
                "user.nom AS userNom",
                "user.prenom AS userPrenom",
                "user.email AS userEmail",
                "user.motDePasse AS userMotDePasse",
                "user.role AS userRole",
                "user.dateInscription AS userDateInscription",
                "user.avatar AS userAvatar",
                "user.coins AS userCoins",
                "user.totalPoints AS userTotalPoints",
                "user.numTel AS userNumTel",
                "famille.idFamille AS idFamille"
            ])
                .getRawMany();
            // Reformate les résultats pour structurer les données
            return taches.map(tache => ({
                idTache: tache.idTache,
                nom: tache.nom,
                date_debut: tache.date_debut,
                date_fin: tache.date_fin,
                status: tache.status,
                type: tache.type,
                description: tache.description,
                priorite: tache.priorite,
                idFamille: tache.idFamille, // Ajout de l'ID de la famille directement dans la tâche
                user: {
                    id: tache.userId,
                    nom: tache.userNom,
                    prenom: tache.userPrenom,
                    email: tache.userEmail,
                    motDePasse: tache.userMotDePasse,
                    role: tache.userRole,
                    dateInscription: tache.userDateInscription,
                    avatar: tache.userAvatar,
                    coins: tache.userCoins,
                    totalPoints: tache.userTotalPoints,
                    numTel: tache.userNumTel
                }
            }));
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
