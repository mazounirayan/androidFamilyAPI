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
const tache_validator_1 = require("../validators/tache-validator");
const tache_1 = require("../database/entities/tache");
const generate_validation_message_1 = require("../validators/generate-validation-message");
const TacheHandler = (app) => {
    const tacheUsecase = new tache_usecase_1.TacheUsecase(database_1.AppDataSource);
    // Créer une nouvelle tâche
    app.post("/taches", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = tache_validator_1.createTacheValidation.validate(req.body);
        if (validation.error) {
            res.status(400).send({ error: validation.error.details });
            return;
        }
        const tacheRequest = validation.value;
        const TacheRepo = database_1.AppDataSource.getRepository(tache_1.Tache);
        try {
            const userCreated = yield TacheRepo.save(tacheRequest);
            res.status(201).send(userCreated);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    // Récupérer une tâche par ID
    app.get("/taches/:idTache", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = tache_validator_1.TacheIdValidation.validate(req.params);
        if (validation.error) {
            res.status(400).send({ error: validation.error.details });
            return;
        }
        const { id } = validation.value;
        try {
            const tache = yield tacheUsecase.getTacheById(id);
            if (!tache) {
                res.status(404).send({ error: "Tache not found" });
                return;
            }
            res.status(200).send(tache);
        }
        catch (error) {
            console.error(error);
            res.status(500).send({ error: "Internal server error" });
        }
    }));
    // Lister toutes les tâches (avec filtrage et pagination)
    app.get("/taches", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = tache_validator_1.listTacheValidation.validate(req.query);
        if (validation.error) {
            return res.status(400).json({
                error: "Invalid filters",
                details: validation.error.details
            });
        }
        const { page, limit, status, type, nom } = validation.value;
        const filters = {
            page,
            limit,
            status,
            type,
            nom: nom ? `%${nom}%` : undefined
        };
        const taches = yield tacheUsecase.listTaches(filters);
        res.status(200).json(taches);
    }));
    // Mettre à jour une tâche
    app.patch("/taches/:idTache", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = tache_validator_1.updateTacheValidation.validate(Object.assign(Object.assign({}, req.params), req.body));
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const tacheUsecase = new tache_usecase_1.TacheUsecase(database_1.AppDataSource);
            if ((yield tacheUsecase.verifTache(+req.params.id)) === false) {
                res.status(400).send({ "error": `Bad user` });
                return;
            }
            const updateTacheRequest = validationResult.value;
            const updatedTache = yield tacheUsecase.updateTache(updateTacheRequest.idTache, Object.assign({}, updateTacheRequest));
            if (updatedTache === null) {
                res.status(404).send({ "error": `User ${updateTacheRequest.idTache} not found` });
                return;
            }
            if (updatedTache === "No changes") {
                res.status(400).send({ "error": `No update provided` });
                return;
            }
            res.status(200).send(updatedTache);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    // Supprimer une tâche par ID
    app.delete("/taches/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = tache_validator_1.TacheIdValidation.validate(req.params);
        if (validation.error) {
            res.status(400).send({ error: validation.error.details });
            return;
        }
        const { id } = validation.value;
        try {
            yield tacheUsecase.deleteTache(id);
            res.status(200).send({ message: "Tache deleted successfully" });
        }
        catch (error) {
            console.error(error);
            res.status(500).send({ error: "Internal server error" });
        }
    }));
};
exports.TacheHandler = TacheHandler;
