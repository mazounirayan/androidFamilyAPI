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
exports.TacheHandler = void 0;
const database_1 = require("../database/database");
const tache_usecase_1 = require("../usecases/tache-usecase");
const generate_validation_message_1 = require("../validators/generate-validation-message");
const tache_validator_1 = require("../validators/tache-validator");
const user_1 = require("../database/entities/user");
const famille_1 = require("../database/entities/famille");
const TacheHandler = (app) => {
    // Lister les tâches
    app.get("/taches", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const validation = tache_validator_1.listTacheValidation.validate(req.query);
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const listTacheRequest = validation.value;
        let limit = 20;
        if (listTacheRequest.limit) {
            limit = listTacheRequest.limit;
        }
        const page = (_a = listTacheRequest.page) !== null && _a !== void 0 ? _a : 1;
        try {
            const tacheUsecase = new tache_usecase_1.TacheUsecase(database_1.AppDataSource);
            const listTaches = yield tacheUsecase.listTaches();
            res.status(200).send(listTaches);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.post("/taches", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = tache_validator_1.createTacheValidation.validate(req.body);
        if (validation.error) {
            return res.status(400).json({
                error: (0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details)
            });
        }
        const tacheRequest = validation.value;
        // Conversion des dates en objets Date
        if (tacheRequest.date_debut) {
            tacheRequest.date_debut = new Date(tacheRequest.date_debut);
        }
        if (tacheRequest.date_fin) {
            tacheRequest.date_fin = new Date(tacheRequest.date_fin);
        }
        try {
            const tacheUsecase = new tache_usecase_1.TacheUsecase(database_1.AppDataSource);
            // Vérification des relations
            const [user, famille] = yield Promise.all([
                tacheRequest.idUser ?
                    database_1.AppDataSource.getRepository(user_1.User).findOneBy({ id: tacheRequest.idUser }) :
                    null,
                tacheRequest.idFamille ?
                    database_1.AppDataSource.getRepository(famille_1.Famille).findOneBy({ idFamille: tacheRequest.idFamille }) :
                    null
            ]);
            if (tacheRequest.idUser && !user) {
                return res.status(404).json({
                    error: `Utilisateur avec l'id ${tacheRequest.idUser} introuvable.`
                });
            }
            if (tacheRequest.idFamille && !famille) {
                return res.status(404).json({
                    error: `Famille avec l'id ${tacheRequest.idFamille} introuvable.`
                });
            }
            const tacheCreated = yield tacheUsecase.createTache(Object.assign(Object.assign({}, tacheRequest), { user: user || undefined, famille: famille || undefined // Même chose pour famille
             }));
            return res.status(201).json(tacheCreated);
        }
        catch (error) {
            console.error('Erreur lors de la création de la tâche:', error);
            return res.status(500).json({
                error: "Erreur interne du serveur."
            });
        }
    }));
    // Supprimer une tâche
    app.delete("/taches/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = tache_validator_1.TacheIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const tacheId = validationResult.value;
            const tacheUsecase = new tache_usecase_1.TacheUsecase(database_1.AppDataSource);
            const tache = yield tacheUsecase.getTacheById(tacheId.id);
            if (tache === null) {
                res.status(404).send({ "error": `Tache ${tacheId.id} not found` });
                return;
            }
            yield tacheUsecase.deleteTache(tacheId.id);
            res.status(200).send("Tache supprimée avec succès");
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    // Obtenir une tâche par son ID
    app.get("/taches/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = tache_validator_1.TacheIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const tacheId = validationResult.value;
            const tacheUsecase = new tache_usecase_1.TacheUsecase(database_1.AppDataSource);
            const tache = yield tacheUsecase.getTacheById(tacheId.id);
            if (tache === null) {
                res.status(404).send({ "error": `Tache ${tacheId.id} not found` });
                return;
            }
            res.status(200).send(tache);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    // Mettre à jour une tâche
    app.patch("/taches/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = tache_validator_1.updateTacheValidation.validate(Object.assign(Object.assign({}, req.params), req.body));
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const updateTacheRequest = validationResult.value;
            const tacheUsecase = new tache_usecase_1.TacheUsecase(database_1.AppDataSource);
            const updatedTache = yield tacheUsecase.updateTache(updateTacheRequest.idTache, updateTacheRequest);
            if (!updatedTache) {
                res.status(404).send({ "error": `Tache ${updateTacheRequest.idTache} not found` });
                return;
            }
            res.status(200).send(updatedTache);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    // Marquer une tâche comme terminée
    app.post("/taches/:id/complete", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = tache_validator_1.TacheIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const tacheId = validationResult.value;
            const tacheUsecase = new tache_usecase_1.TacheUsecase(database_1.AppDataSource);
            const tache = yield tacheUsecase.markTacheAsCompleted(tacheId.id);
            if (tache === null) {
                res.status(404).send({ "error": `Tache ${tacheId.id} not found` });
                return;
            }
            res.status(200).send(tache);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.get("/taches/user/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = parseInt(req.params.id, 10);
            const tacheUsecase = new tache_usecase_1.TacheUsecase(database_1.AppDataSource);
            const taches = yield tacheUsecase.listTachesByUserId(userId);
            res.status(200).send(taches);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.get("/taches/famille/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const familleId = parseInt(req.params.id, 10);
            const tacheUsecase = new tache_usecase_1.TacheUsecase(database_1.AppDataSource);
            const taches = yield tacheUsecase.listTachesByFamilleId(familleId);
            res.status(200).send(taches);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.post("/taches/:id/assign", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationIdUser = tache_validator_1.updateTacheValidation.validate(req.body);
            const validationResult = tache_validator_1.TacheIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            if (validationIdUser.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationIdUser.error.details));
                return;
            }
            const userId = validationIdUser.value;
            const tache = validationResult.value;
            if (!userId) {
                res.status(400).send({ error: "User ID is required" });
                return;
            }
            const tacheUsecase = new tache_usecase_1.TacheUsecase(database_1.AppDataSource);
            yield tacheUsecase.assignTacheToUser(tache.id, userId.idUser);
            res.status(200).send({ message: "Task assigned successfully" });
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
};
exports.TacheHandler = TacheHandler;
