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
exports.RecompenseHandler = void 0;
const database_1 = require("../database/database");
const recompense_usecase_1 = require("../usecases/recompense-usecase");
const generate_validation_message_1 = require("../validators/generate-validation-message");
const recompense_validator_1 = require("../validators/recompense-validator");
const RecompenseHandler = (app) => {
    // Lister les récompenses
    app.get("/recompenses", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const validation = recompense_validator_1.listRecompenseValidation.validate(req.query);
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const listRecompenseRequest = validation.value;
        let limit = 20;
        if (listRecompenseRequest.limit) {
            limit = listRecompenseRequest.limit;
        }
        const page = (_a = listRecompenseRequest.page) !== null && _a !== void 0 ? _a : 1;
        try {
            const recompenseUsecase = new recompense_usecase_1.RecompenseUsecase(database_1.AppDataSource);
            const listRecompenses = yield recompenseUsecase.listRecompenses(Object.assign(Object.assign({}, listRecompenseRequest), { page, limit }));
            res.status(200).send(listRecompenses);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    // Créer une récompense
    app.post("/recompenses", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = recompense_validator_1.createRecompenseValidation.validate(req.body);
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const recompenseRequest = validation.value;
        try {
            const recompenseUsecase = new recompense_usecase_1.RecompenseUsecase(database_1.AppDataSource);
            const recompenseCreated = yield recompenseUsecase.createRecompense(recompenseRequest);
            res.status(201).send(recompenseCreated);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    // Supprimer une récompense
    app.delete("/recompenses/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = recompense_validator_1.recompenseIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const recompenseId = validationResult.value;
            const recompenseUsecase = new recompense_usecase_1.RecompenseUsecase(database_1.AppDataSource);
            const recompense = yield recompenseUsecase.getRecompenseById(recompenseId.id);
            if (recompense === null) {
                res.status(404).send({ "error": `Recompense ${recompenseId.id} not found` });
                return;
            }
            yield recompenseUsecase.deleteRecompense(recompenseId.id);
            res.status(200).send("Recompense supprimée avec succès");
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    // Obtenir une récompense par son ID
    app.get("/recompenses/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = recompense_validator_1.recompenseIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const recompenseId = validationResult.value;
            const recompenseUsecase = new recompense_usecase_1.RecompenseUsecase(database_1.AppDataSource);
            const recompense = yield recompenseUsecase.getRecompenseById(recompenseId.id);
            if (recompense === null) {
                res.status(404).send({ "error": `Recompense ${recompenseId.id} not found` });
                return;
            }
            res.status(200).send(recompense);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    // Mettre à jour une récompense
    app.patch("/recompenses/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = recompense_validator_1.updateRecompenseValidation.validate(Object.assign(Object.assign({}, req.params), req.body));
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const updateRecompenseRequest = validationResult.value;
            const recompenseUsecase = new recompense_usecase_1.RecompenseUsecase(database_1.AppDataSource);
            const updatedRecompense = yield recompenseUsecase.updateRecompense(updateRecompenseRequest.id, updateRecompenseRequest);
            if (updatedRecompense === null) {
                res.status(404).send({ "error": `Recompense ${updateRecompenseRequest.id} not found` });
                return;
            }
            res.status(200).send(updatedRecompense);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    // Acheter une récompense
    app.post("/recompenses/:id/buy", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = recompense_validator_1.recompenseIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const recompenseId = validationResult.value;
            const recompenseUsecase = new recompense_usecase_1.RecompenseUsecase(database_1.AppDataSource);
            const recompense = yield recompenseUsecase.buyRecompense(req.body.idUser, recompenseId.id);
            if (recompense === null) {
                res.status(404).send({ "error": `Recompense ${recompenseId.id} not found` });
                return;
            }
            res.status(200).send(recompense);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.get("/recompenses/user/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = recompense_validator_1.recompenseIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const userId = validationResult.value;
            const recompenseUsecase = new recompense_usecase_1.RecompenseUsecase(database_1.AppDataSource);
            const recompenses = yield recompenseUsecase.listRecompensesByUserId(userId.id);
            if (recompenses === null) {
                res.status(404).send({ "error": `Recompense ${userId} not found` });
                return;
            }
            res.status(200).send(recompenses);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.get("/familles/:idFamille/recompenses", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { idFamille } = req.params;
        if (!idFamille || isNaN(Number(idFamille))) {
            res.status(400).send({ error: "Invalid family ID." });
            return;
        }
        try {
            const recompenseUsecase = new recompense_usecase_1.RecompenseUsecase(database_1.AppDataSource);
            const recompenses = yield recompenseUsecase.getRecompensesByFamille(Number(idFamille));
            res.status(200).send(recompenses);
        }
        catch (error) {
            console.error(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
};
exports.RecompenseHandler = RecompenseHandler;
