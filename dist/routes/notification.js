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
exports.NotificationHandler = void 0;
const database_1 = require("../database/database");
const notification_usecase_1 = require("../usecases/notification-usecase");
const generate_validation_message_1 = require("../validators/generate-validation-message");
const notification_validator_1 = require("../validators/notification-validator");
const NotificationHandler = (app) => {
    app.get("/notifications", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const validation = notification_validator_1.listNotificationValidation.validate(req.query);
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const listNotificationRequest = validation.value;
        let limit = 20;
        if (listNotificationRequest.limit) {
            limit = listNotificationRequest.limit;
        }
        const page = (_a = listNotificationRequest.page) !== null && _a !== void 0 ? _a : 1;
        try {
            const notificationUsecase = new notification_usecase_1.NotificationUsecase(database_1.AppDataSource);
            const listNotifications = yield notificationUsecase.listNotifications(Object.assign(Object.assign({}, listNotificationRequest), { page, limit }));
            res.status(200).send(listNotifications);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.post("/notifications", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = notification_validator_1.createNotificationValidation.validate(req.body);
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const notificationRequest = validation.value;
        try {
            const notificationUsecase = new notification_usecase_1.NotificationUsecase(database_1.AppDataSource);
            const notificationCreated = yield notificationUsecase.createNotification(notificationRequest);
            res.status(201).send(notificationCreated);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.delete("/notifications/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = notification_validator_1.notificationIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const notificationId = validationResult.value;
            const notificationUsecase = new notification_usecase_1.NotificationUsecase(database_1.AppDataSource);
            const notification = yield notificationUsecase.getNotificationById(notificationId.id);
            if (notification === null) {
                res.status(404).send({ "error": `Notification ${notificationId.id} not found` });
                return;
            }
            yield notificationUsecase.deleteNotification(notificationId.id);
            res.status(200).send("Notification supprimée avec succès");
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.get("/notifications/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = notification_validator_1.notificationIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const notificationId = validationResult.value;
            const notificationUsecase = new notification_usecase_1.NotificationUsecase(database_1.AppDataSource);
            const notification = yield notificationUsecase.getNotificationById(notificationId.id);
            if (notification === null) {
                res.status(404).send({ "error": `Notification ${notificationId.id} not found` });
                return;
            }
            res.status(200).send(notification);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.patch("/notifications/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = notification_validator_1.updateNotificationValidation.validate(Object.assign(Object.assign({}, req.params), req.body));
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const updateNotificationRequest = validationResult.value;
            const notificationUsecase = new notification_usecase_1.NotificationUsecase(database_1.AppDataSource);
            const updatedNotification = yield notificationUsecase.updateNotification(updateNotificationRequest.id, updateNotificationRequest);
            if (updatedNotification === null) {
                res.status(404).send({ "error": `Notification ${updateNotificationRequest.id} not found` });
                return;
            }
            res.status(200).send(updatedNotification);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
};
exports.NotificationHandler = NotificationHandler;
