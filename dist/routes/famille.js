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
const famille_1 = require("../database/entities/famille");
const famille_validator_1 = require("../validators/famille-validator");
const famille_validator_2 = require("../validators/famille-validator");
const FamilleHandler = (app) => {
    // Créer une nouvelle famille
    app.post("/familles", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = famille_validator_1.createFamilleValidation.validate(req.body);
        if (validation.error) {
            res.status(400).send({ error: validation.error.details });
            return;
        }
        const familleRepo = database_1.AppDataSource.getRepository(famille_1.Famille);
        const familleData = validation.value;
        try {
            const newFamille = familleRepo.create(familleData);
            const savedFamille = yield familleRepo.save(newFamille);
            res.status(201).send(savedFamille);
        }
        catch (error) {
            console.error(error);
            res.status(500).send({ error: "Internal server error" });
        }
    }));
    // Récupérer une famille par ID
    app.get("/familles/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = famille_validator_1.FamilleIdValidation.validate(req.params);
        if (validation.error) {
            res.status(400).send({ error: validation.error.details });
            return;
        }
        const familleRepo = database_1.AppDataSource.getRepository(famille_1.Famille);
        const { id } = validation.value;
        try {
            const famille = yield familleRepo.findOneBy({ idFamille: id });
            if (!famille) {
                res.status(404).send({ error: "Famille not found" });
                return;
            }
            res.status(200).send(famille);
        }
        catch (error) {
            console.error(error);
            res.status(500).send({ error: "Internal server error" });
        }
    }));
    // Lister toutes les familles
    app.get("/familles", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const familleRepo = database_1.AppDataSource.getRepository(famille_1.Famille);
        try {
            const familles = yield familleRepo.find();
            res.status(200).send(familles);
        }
        catch (error) {
            console.error(error);
            res.status(500).send({ error: "Internal server error" });
        }
    }));
    // Supprimer une famille par ID
    app.delete("/familles/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = famille_validator_1.FamilleIdValidation.validate(req.params);
        if (validation.error) {
            res.status(400).send({ error: validation.error.details });
            return;
        }
        const familleRepo = database_1.AppDataSource.getRepository(famille_1.Famille);
        const { id } = validation.value;
        try {
            const famille = yield familleRepo.findOneBy({ idFamille: id });
            if (!famille) {
                res.status(404).send({ error: "Famille not found" });
                return;
            }
            yield familleRepo.remove(famille);
            res.status(200).send({ message: "Famille deleted successfully" });
        }
        catch (error) {
            console.error(error);
            res.status(500).send({ error: "Internal server error" });
        }
    }));
    app.put("/familles/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = famille_validator_2.updateFamilleValidation.validate(Object.assign({ id: req.params.id }, req.body));
        if (validation.error) {
            res.status(400).send({ error: validation.error.details });
            return;
        }
        const familleRepo = database_1.AppDataSource.getRepository(famille_1.Famille);
        const { id, nom } = validation.value;
        try {
            const famille = yield familleRepo.findOneBy({ idFamille: id });
            if (!famille) {
                res.status(404).send({ error: "Famille not found" });
                return;
            }
            if (nom)
                famille.nom = nom;
            const updatedFamille = yield familleRepo.save(famille);
            res.status(200).send(updatedFamille);
        }
        catch (error) {
            console.error(error);
            res.status(500).send({ error: "Internal server error" });
        }
    }));
};
exports.FamilleHandler = FamilleHandler;
