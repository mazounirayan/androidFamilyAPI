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
const notification_validator_1 = require("../validators/notification-validator");
const NotificationHandler = (app) => {
    const notificationUsecase = new notification_usecase_1.NotificationUsecase(database_1.AppDataSource);
    app.post("/notifications", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = notification_validator_1.createNotificationValidation.validate(req.body);
        if (validation.error) {
            return res.status(400).send(validation.error.details);
        }
        try {
            const notification = yield notificationUsecase.createNotification(validation.value);
            res.status(201).send(notification);
        }
        catch (error) {
            console.error(error);
            res.status(500).send({ error: "Internal server error" });
        }
    }));
    app.patch("/notifications/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = notification_validator_1.updateNotificationValidation.validate(Object.assign(Object.assign({}, req.body), { idNotification: req.params.id }));
        if (validation.error) {
            return res.status(400).send(validation.error.details);
        }
        try {
            const updated = yield notificationUsecase.markAsViewed(+req.params.id);
            res.status(200).send(updated);
        }
        catch (error) {
            console.error(error);
            res.status(500).send({ error: "Internal server error" });
        }
    }));
    app.get("/notifications/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const notifications = yield notificationUsecase.listNotifications(+req.params.userId);
            res.status(200).send(notifications);
        }
        catch (error) {
            console.error(error);
            res.status(500).send({ error: "Internal server error" });
        }
    }));
};
exports.NotificationHandler = NotificationHandler;
