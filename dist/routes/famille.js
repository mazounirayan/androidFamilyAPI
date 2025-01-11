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
exports.FamilleHandler = void 0;
const database_1 = require("../database/database");
const famille_usecase_1 = require("../usecases/famille-usecase");
const generate_validation_message_1 = require("../validators/generate-validation-message");
const famille_validator_1 = require("../validators/famille-validator");
const FamilleHandler = (app) => {
    app.get("/familles", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const validation = famille_validator_1.listFamilleValidation.validate(req.query);
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const listFamilleRequest = validation.value;
        let limit = 20;
        if (listFamilleRequest.limit) {
            limit = listFamilleRequest.limit;
        }
        const page = (_a = listFamilleRequest.page) !== null && _a !== void 0 ? _a : 1;
        try {
            const familleUsecase = new famille_usecase_1.FamilleUsecase(database_1.AppDataSource);
            const listFamilles = yield familleUsecase.listFamilles(Object.assign(Object.assign({}, listFamilleRequest), { page, limit }));
            res.status(200).send(listFamilles);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.post("/familles", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = famille_validator_1.createFamilleValidation.validate(req.body);
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const familleRequest = validation.value;
        try {
            const familleUsecase = new famille_usecase_1.FamilleUsecase(database_1.AppDataSource);
            const familleCreated = yield familleUsecase.createFamille(familleRequest);
            res.status(201).send(familleCreated);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.delete("/familles/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = famille_validator_1.FamilleIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const familleId = validationResult.value;
            const familleUsecase = new famille_usecase_1.FamilleUsecase(database_1.AppDataSource);
            const famille = yield familleUsecase.getFamilleById(familleId.id);
            if (famille === null) {
                res.status(404).send({ "error": `Famille ${familleId.id} not found` });
                return;
            }
            yield familleUsecase.deleteFamille(familleId.id);
            res.status(200).send("Famille supprimée avec succès");
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.get("/familles/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = famille_validator_1.FamilleIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const familleId = validationResult.value;
            const familleUsecase = new famille_usecase_1.FamilleUsecase(database_1.AppDataSource);
            const famille = yield familleUsecase.getFamilleById(familleId.id);
            if (famille === null) {
                res.status(404).send({ "error": `Famille ${familleId.id} not found` });
                return;
            }
            res.status(200).send(famille);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.patch("/familles/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = famille_validator_1.updateFamilleValidation.validate(req.body);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const updateFamilleRequest = validationResult.value;
            const familleUsecase = new famille_usecase_1.FamilleUsecase(database_1.AppDataSource);
            const updatedFamille = yield familleUsecase.updateFamille(updateFamilleRequest.id, updateFamilleRequest);
            if (!updatedFamille) {
                res.status(404).send({ "error": `Famille ${updateFamilleRequest.id} not found` });
                return;
            }
            res.status(200).send(updatedFamille);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
};
exports.FamilleHandler = FamilleHandler;
