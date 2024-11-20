import express, { Request, Response } from "express";
import { AppDataSource } from "../database/database";
import { NotificationUsecase } from "../usecases/notification-usecase";
import { createNotificationValidation, updateNotificationValidation } from "../validators/notification-validator";

export const NotificationHandler = (app: express.Express) => {
    const notificationUsecase = new NotificationUsecase(AppDataSource);

    app.post("/notifications", async (req: Request, res: Response) => {
        const validation = createNotificationValidation.validate(req.body);
        if (validation.error) {
            return res.status(400).send(validation.error.details);
        }

        try {
            const notification = await notificationUsecase.createNotification(validation.value);
            res.status(201).send(notification);
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: "Internal server error" });
        }
    });

    app.patch("/notifications/:id", async (req: Request, res: Response) => {
        const validation = updateNotificationValidation.validate({ ...req.body, idNotification: req.params.id });
        if (validation.error) {
            return res.status(400).send(validation.error.details);
        }

        try {
            const updated = await notificationUsecase.markAsViewed(+req.params.id);
            res.status(200).send(updated);
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: "Internal server error" });
        }
    });

    app.get("/notifications/:userId", async (req: Request, res: Response) => {
        try {
            const notifications = await notificationUsecase.listNotifications(+req.params.userId);
            res.status(200).send(notifications);
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: "Internal server error" });
        }
    });
};
