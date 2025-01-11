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
exports.BadgeHandler = void 0;
const database_1 = require("../database/database");
const badge_usecase_1 = require("../usecases/badge-usecase");
const generate_validation_message_1 = require("../validators/generate-validation-message");
const badge_validator_1 = require("../validators/badge-validator");
const user_validator_1 = require("../validators/user-validator");
const BadgeHandler = (app) => {
    // Lister les badges
    app.get("/badges", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const validation = badge_validator_1.listBadgeValidation.validate(req.query);
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const listBadgeRequest = validation.value;
        let limit = 20;
        if (listBadgeRequest.limit) {
            limit = listBadgeRequest.limit;
        }
        const page = (_a = listBadgeRequest.page) !== null && _a !== void 0 ? _a : 1;
        try {
            const badgeUsecase = new badge_usecase_1.BadgeUsecase(database_1.AppDataSource);
            const listBadges = yield badgeUsecase.listBadges(Object.assign(Object.assign({}, listBadgeRequest), { page, limit }));
            res.status(200).send(listBadges);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    // Créer un badge
    app.post("/badges", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = badge_validator_1.createBadgeValidation.validate(req.body);
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const badgeRequest = validation.value;
        try {
            const badgeUsecase = new badge_usecase_1.BadgeUsecase(database_1.AppDataSource);
            const badgeCreated = yield badgeUsecase.createBadge(badgeRequest);
            res.status(201).send(badgeCreated);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    // Supprimer un badge
    app.delete("/badges/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = badge_validator_1.badgeIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const badgeId = validationResult.value;
            const badgeUsecase = new badge_usecase_1.BadgeUsecase(database_1.AppDataSource);
            const badge = yield badgeUsecase.getBadgeById(badgeId.id);
            if (badge === null) {
                res.status(404).send({ "error": `Badge ${badgeId.id} not found` });
                return;
            }
            yield badgeUsecase.deleteBadge(badgeId.id);
            res.status(200).send("Badge supprimé avec succès");
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    // Obtenir un badge par son ID
    app.get("/badges/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = badge_validator_1.badgeIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const badgeId = validationResult.value;
            const badgeUsecase = new badge_usecase_1.BadgeUsecase(database_1.AppDataSource);
            const badge = yield badgeUsecase.getBadgeById(badgeId.id);
            if (badge === null) {
                res.status(404).send({ "error": `Badge ${badgeId.id} not found` });
                return;
            }
            res.status(200).send(badge);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    // Mettre à jour un badge
    app.patch("/badges/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = badge_validator_1.updateBadgeValidation.validate(Object.assign(Object.assign({}, req.params), req.body));
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const updateBadgeRequest = validationResult.value;
            const badgeUsecase = new badge_usecase_1.BadgeUsecase(database_1.AppDataSource);
            const updatedBadge = yield badgeUsecase.updateBadge(updateBadgeRequest.id, updateBadgeRequest);
            if (updatedBadge === null) {
                res.status(404).send({ "error": `Badge ${updateBadgeRequest.id} not found` });
                return;
            }
            res.status(200).send(updatedBadge);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    // Attribuer un badge à un utilisateur
    app.post("/badges/:id/assign", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = badge_validator_1.badgeIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const badgeId = validationResult.value.id;
            const { userId } = req.body;
            if (!userId) {
                res.status(400).send({ error: "User ID is required" });
                return;
            }
            const badgeUsecase = new badge_usecase_1.BadgeUsecase(database_1.AppDataSource);
            yield badgeUsecase.assignBadgeToUser(userId, badgeId);
            res.status(200).send({ message: "Badge assigned successfully" });
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.get("/badges/user/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = user_validator_1.userIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const userId = validationResult.value.id;
            const badgeUsecase = new badge_usecase_1.BadgeUsecase(database_1.AppDataSource);
            const badges = yield badgeUsecase.getBadgesByUserId(userId);
            res.status(200).send(badges);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.delete("/badges/:id/unassign", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = badge_validator_1.badgeIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const badgeId = validationResult.value.id;
            const { userId } = req.body;
            if (!userId) {
                res.status(400).send({ error: "User ID is required" });
                return;
            }
            const badgeUsecase = new badge_usecase_1.BadgeUsecase(database_1.AppDataSource);
            yield badgeUsecase.unassignBadgeFromUser(userId, badgeId);
            res.status(200).send({ message: "Badge unassigned successfully" });
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
};
exports.BadgeHandler = BadgeHandler;
