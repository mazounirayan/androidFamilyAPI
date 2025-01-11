import express, { Request, Response } from 'express';
import { AppDataSource } from '../database/database';
import { Notification } from '../database/entities/notification';
import { NotificationUsecase } from '../usecases/notification-usecase';
import { generateValidationErrorMessage } from '../validators/generate-validation-message';
import { listNotificationValidation, createNotificationValidation, notificationIdValidation, updateNotificationValidation } from '../validators/notification-validator';

export const NotificationHandler = (app: express.Express) => {

    app.get("/notifications", async (req: Request, res: Response) => {
        const validation = listNotificationValidation.validate(req.query);

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }

        const listNotificationRequest = validation.value;
        let limit = 20;
        if (listNotificationRequest.limit) {
            limit = listNotificationRequest.limit;
        }
        const page = listNotificationRequest.page ?? 1;

        try {
            const notificationUsecase = new NotificationUsecase(AppDataSource);
            const listNotifications = await notificationUsecase.listNotifications({ ...listNotificationRequest, page, limit });
            res.status(200).send(listNotifications);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.post("/notifications", async (req: Request, res: Response) => {
        const validation = createNotificationValidation.validate(req.body);

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }

        const notificationRequest = validation.value;

        try {
            const notificationUsecase = new NotificationUsecase(AppDataSource);
            const notificationCreated = await notificationUsecase.createNotification(notificationRequest);
            res.status(201).send(notificationCreated);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.delete("/notifications/:id", async (req: Request, res: Response) => {
        try {
            const validationResult = notificationIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }

            const notificationId = validationResult.value;

            const notificationUsecase = new NotificationUsecase(AppDataSource);
            const notification = await notificationUsecase.getNotificationById(notificationId.id);

            if (notification === null) {
                res.status(404).send({ "error": `Notification ${notificationId.id} not found` });
                return;
            }

            await notificationUsecase.deleteNotification(notificationId.id);
            res.status(200).send("Notification supprimée avec succès");
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.get("/notifications/:id", async (req: Request, res: Response) => {
        try {
            const validationResult = notificationIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }

            const notificationId = validationResult.value;

            const notificationUsecase = new NotificationUsecase(AppDataSource);
            const notification = await notificationUsecase.getNotificationById(notificationId.id);

            if (notification === null) {
                res.status(404).send({ "error": `Notification ${notificationId.id} not found` });
                return;
            }

            res.status(200).send(notification);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.patch("/notifications/:id", async (req: Request, res: Response) => {
        try {
            const validationResult = updateNotificationValidation.validate({ ...req.params, ...req.body });

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }

            const updateNotificationRequest = validationResult.value;

            const notificationUsecase = new NotificationUsecase(AppDataSource);
            const updatedNotification = await notificationUsecase.updateNotification(updateNotificationRequest.id, updateNotificationRequest);

            if (updatedNotification === null) {
                res.status(404).send({ "error": `Notification ${updateNotificationRequest.id} not found` });
                return;
            }

            res.status(200).send(updatedNotification);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });
};