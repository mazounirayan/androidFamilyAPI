import express, { Request, Response } from 'express';
import { AppDataSource } from '../database/database';
import { Badge } from '../database/entities/Badge';
import { BadgeUsecase } from '../usecases/badge-usecase';
import { generateValidationErrorMessage } from '../validators/generate-validation-message';
import { listBadgeValidation, createBadgeValidation, badgeIdValidation, updateBadgeValidation } from '../validators/badge-validator';


export const BadgeHandler = (app: express.Express) => {

    // Lister les badges
    app.get("/badges", async (req: Request, res: Response) => {
        const validation = listBadgeValidation.validate(req.query);

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }

        const listBadgeRequest = validation.value;
        let limit = 20;
        if (listBadgeRequest.limit) {
            limit = listBadgeRequest.limit;
        }
        const page = listBadgeRequest.page ?? 1;

        try {
            const badgeUsecase = new BadgeUsecase(AppDataSource);
            const listBadges = await badgeUsecase.listBadges({ ...listBadgeRequest, page, limit });
            res.status(200).send(listBadges);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    // Créer un badge
    app.post("/badges", async (req: Request, res: Response) => {
        const validation = createBadgeValidation.validate(req.body);

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }

        const badgeRequest = validation.value;

        try {
            const badgeUsecase = new BadgeUsecase(AppDataSource);
            const badgeCreated = await badgeUsecase.createBadge(badgeRequest);
            res.status(201).send(badgeCreated);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    // Supprimer un badge
    app.delete("/badges/:id", async (req: Request, res: Response) => {
        try {
            const validationResult = badgeIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }

            const badgeId = validationResult.value;

            const badgeUsecase = new BadgeUsecase(AppDataSource);
            const badge = await badgeUsecase.getBadgeById(badgeId.id);

            if (badge === null) {
                res.status(404).send({ "error": `Badge ${badgeId.id} not found` });
                return;
            }

            await badgeUsecase.deleteBadge(badgeId.id);
            res.status(200).send("Badge supprimé avec succès");
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    // Obtenir un badge par son ID
    app.get("/badges/:id", async (req: Request, res: Response) => {
        try {
            const validationResult = badgeIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }

            const badgeId = validationResult.value;

            const badgeUsecase = new BadgeUsecase(AppDataSource);
            const badge = await badgeUsecase.getBadgeById(badgeId.id);

            if (badge === null) {
                res.status(404).send({ "error": `Badge ${badgeId.id} not found` });
                return;
            }

            res.status(200).send(badge);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    // Mettre à jour un badge
    app.patch("/badges/:id", async (req: Request, res: Response) => {
        try {
            const validationResult = updateBadgeValidation.validate({ ...req.params, ...req.body });

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }

            const updateBadgeRequest = validationResult.value;

            const badgeUsecase = new BadgeUsecase(AppDataSource);
            const updatedBadge = await badgeUsecase.updateBadge(updateBadgeRequest.id, updateBadgeRequest);

            if (updatedBadge === null) {
                res.status(404).send({ "error": `Badge ${updateBadgeRequest.id} not found` });
                return;
            }

            res.status(200).send(updatedBadge);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

      // Attribuer un badge à un utilisateur
      app.post("/badges/:id/assign", async (req: Request, res: Response) => {
        try {
            const validationResult = badgeIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }

            const badgeId = validationResult.value.id;

            const { userId } = req.body;

            if (!userId) {
                res.status(400).send({ error: "User ID is required" });
                return;
            }

            const badgeUsecase = new BadgeUsecase(AppDataSource);
            await badgeUsecase.assignBadgeToUser(userId, badgeId);

            res.status(200).send({ message: "Badge assigned successfully" });
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

}