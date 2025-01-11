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
exports.CategorieTache = void 0;
const database_1 = require("../database/database");
const CategorieTache_usecase_1 = require("../usecases/CategorieTache-usecase");
const CategorieTache_validator_1 = require("../validators/CategorieTache-validator");
const generate_validation_message_1 = require("../validators/generate-validation-message");
const CategorieTache = (app) => {
    app.get("/categories-tache", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const categorieUsecase = new CategorieTache_usecase_1.CategorieTacheUsecase(database_1.AppDataSource);
            const categories = yield categorieUsecase.listCategoriesTache();
            res.status(200).send(categories);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.post("/categories-tache", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validation = CategorieTache_validator_1.createCategorieTacheValidation.validate(req.body);
            if (validation.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
                return;
            }
            const categorieRequest = validation.value;
            const categorieUsecase = new CategorieTache_usecase_1.CategorieTacheUsecase(database_1.AppDataSource);
            const categorieCreated = yield categorieUsecase.createCategorieTache(categorieRequest);
            res.status(201).send(categorieCreated);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.get("/categories-tache/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const categorieId = parseInt(req.params.id, 10);
            const categorieUsecase = new CategorieTache_usecase_1.CategorieTacheUsecase(database_1.AppDataSource);
            const categorie = yield categorieUsecase.getCategorieTacheById(categorieId);
            if (!categorie) {
                res.status(404).send({ error: `Category ${categorieId} not found` });
                return;
            }
            res.status(200).send(categorie);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.patch("/categories-tache/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validation = CategorieTache_validator_1.updateCategorieTacheValidation.validate(Object.assign(Object.assign({}, req.params), req.body));
            if (validation.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
                return;
            }
            const updateRequest = validation.value;
            const categorieUsecase = new CategorieTache_usecase_1.CategorieTacheUsecase(database_1.AppDataSource);
            const updatedCategorie = yield categorieUsecase.updateCategorieTache(updateRequest.id, updateRequest);
            if (!updatedCategorie) {
                res.status(404).send({ error: `Category ${updateRequest.id} not found` });
                return;
            }
            res.status(200).send(updatedCategorie);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.delete("/categories-tache/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const categorieId = parseInt(req.params.id, 10);
            const categorieUsecase = new CategorieTache_usecase_1.CategorieTacheUsecase(database_1.AppDataSource);
            yield categorieUsecase.deleteCategorieTache(categorieId);
            res.status(200).send({ message: "Category deleted successfully" });
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
};
exports.CategorieTache = CategorieTache;
