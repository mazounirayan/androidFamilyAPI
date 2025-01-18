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
exports.UserHandler = void 0;
const database_1 = require("../../database/database");
const user_usecase_1 = require("../../usecases/user-usecase");
const generate_validation_message_1 = require("../../validators/generate-validation-message");
const user_validator_1 = require("../../validators/user-validator");
const famille_validator_1 = require("../../validators/famille-validator");
const famille_usecase_1 = require("../../usecases/famille-usecase");
const UserHandler = (app) => {
    // Lister les utilisateurs
    app.get("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const validation = user_validator_1.listUserValidation.validate(req.query);
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const listUserRequest = validation.value;
        let limit = 20;
        if (listUserRequest.limit) {
            limit = listUserRequest.limit;
        }
        const page = (_a = listUserRequest.page) !== null && _a !== void 0 ? _a : 1;
        try {
            const userUsecase = new user_usecase_1.UserUsecase(database_1.AppDataSource);
            const listUsers = yield userUsecase.listUsers();
            // Encapsuler le tableau dans un objet avec la clé "user"
            res.status(200).send({ user: listUsers });
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    // Créer un utilisateur
    app.post("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = user_validator_1.createUserValidation.validate(req.body);
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const userRequest = validation.value;
        try {
            const userUsecase = new user_usecase_1.UserUsecase(database_1.AppDataSource);
            const userCreated = yield userUsecase.createUser(userRequest);
            res.status(201).send(userCreated);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    // Supprimer un utilisateur
    app.delete("/users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = user_validator_1.userIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const userId = validationResult.value;
            const userUsecase = new user_usecase_1.UserUsecase(database_1.AppDataSource);
            const user = yield userUsecase.getUserById(userId.id);
            if (user === null) {
                res.status(404).send({ "error": `User ${userId.id} not found` });
                return;
            }
            yield userUsecase.deleteUser(userId.id);
            res.status(200).send("User supprimé avec succès");
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    // Obtenir un utilisateur par son ID
    app.get("/users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = user_validator_1.userIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const userId = validationResult.value;
            const userUsecase = new user_usecase_1.UserUsecase(database_1.AppDataSource);
            const user = yield userUsecase.getUserById(userId.id);
            if (user === null) {
                res.status(404).send({ "error": `User ${userId.id} not found` });
                return;
            }
            res.status(200).send(user);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    // Mettre à jour un utilisateur
    app.patch("/users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = user_validator_1.updateUserValidation.validate(Object.assign(Object.assign({}, req.params), req.body));
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const updateUserRequest = validationResult.value;
            const userUsecase = new user_usecase_1.UserUsecase(database_1.AppDataSource);
            const updatedUser = yield userUsecase.updateUser(updateUserRequest.id, updateUserRequest);
            if (updatedUser === null) {
                res.status(404).send({ "error": `User ${updateUserRequest.id} not found` });
                return;
            }
            res.status(200).send(updatedUser);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    // Ajouter un utilisateur à une famille
    app.post("/users/:id/famille", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = user_validator_1.userIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const userId = validationResult.value;
            const userUsecase = new user_usecase_1.UserUsecase(database_1.AppDataSource);
            const user = yield userUsecase.addUserToFamille(userId.id, req.body.idFamille);
            if (user === null) {
                res.status(404).send({ "error": `User ${userId.id} not found` });
                return;
            }
            res.status(200).send(user);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.get("/users/family/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = famille_validator_1.FamilleIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const idFamille = validationResult.value.id;
            // Utilisation du UserUsecase pour récupérer les utilisateurs
            const familleUsecase = new famille_usecase_1.FamilleUsecase(database_1.AppDataSource);
            const users = yield familleUsecase.getFamilyMembers(idFamille);
            res.status(200).send(users);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
};
exports.UserHandler = UserHandler;
