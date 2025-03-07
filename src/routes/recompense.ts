import express, { Request, Response } from 'express';
import { AppDataSource } from '../database/database';
import { Recompense } from '../database/entities/recompense';
import { RecompenseUsecase } from '../usecases/recompense-usecase';
import { generateValidationErrorMessage } from '../validators/generate-validation-message';
import { listRecompenseValidation, createRecompenseValidation, recompenseIdValidation, updateRecompenseValidation } from '../validators/recompense-validator';


export const RecompenseHandler = (app: express.Express) => {

    // Lister les récompenses
    app.get("/recompenses", async (req: Request, res: Response) => {
        const validation = listRecompenseValidation.validate(req.query);

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }

        const listRecompenseRequest = validation.value;
        let limit = 20;
        if (listRecompenseRequest.limit) {
            limit = listRecompenseRequest.limit;
        }
        const page = listRecompenseRequest.page ?? 1;

        try {
            const recompenseUsecase = new RecompenseUsecase(AppDataSource);
            const listRecompenses = await recompenseUsecase.listRecompenses({ ...listRecompenseRequest, page, limit });
            res.status(200).send(listRecompenses);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    // Créer une récompense
    app.post("/recompenses", async (req: Request, res: Response) => {
        const validation = createRecompenseValidation.validate(req.body);

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }

        const recompenseRequest = validation.value;

        try {
            const recompenseUsecase = new RecompenseUsecase(AppDataSource);
            const recompenseCreated = await recompenseUsecase.createRecompense(recompenseRequest);
            res.status(201).send(recompenseCreated);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    // Supprimer une récompense
    app.delete("/recompenses/:id", async (req: Request, res: Response) => {
        try {
            const validationResult = recompenseIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }

            const recompenseId = validationResult.value;

            const recompenseUsecase = new RecompenseUsecase(AppDataSource);
            const recompense = await recompenseUsecase.getRecompenseById(recompenseId.id);

            if (recompense === null) {
                res.status(404).send({ "error": `Recompense ${recompenseId.id} not found` });
                return;
            }

            await recompenseUsecase.deleteRecompense(recompenseId.id);
            res.status(200).send("Recompense supprimée avec succès");
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    // Obtenir une récompense par son ID
    app.get("/recompenses/:id", async (req: Request, res: Response) => {
        try {
            const validationResult = recompenseIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }

            const recompenseId = validationResult.value;

            const recompenseUsecase = new RecompenseUsecase(AppDataSource);
            const recompense = await recompenseUsecase.getRecompenseById(recompenseId.id);

            if (recompense === null) {
                res.status(404).send({ "error": `Recompense ${recompenseId.id} not found` });
                return;
            }

            res.status(200).send(recompense);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    // Mettre à jour une récompense
    app.patch("/recompenses/:id", async (req: Request, res: Response) => {
        try {
            const validationResult = updateRecompenseValidation.validate({ ...req.params, ...req.body });

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }

            const updateRecompenseRequest = validationResult.value;

            const recompenseUsecase = new RecompenseUsecase(AppDataSource);
            const updatedRecompense = await recompenseUsecase.updateRecompense(updateRecompenseRequest.id, updateRecompenseRequest);

            if (updatedRecompense === null) {
                res.status(404).send({ "error": `Recompense ${updateRecompenseRequest.id} not found` });
                return;
            }

            res.status(200).send(updatedRecompense);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    // Acheter une récompense
    app.post("/recompenses/:id/buy", async (req: Request, res: Response) => {
        try {
            const validationResult = recompenseIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }

            const recompenseId = validationResult.value;

            const recompenseUsecase = new RecompenseUsecase(AppDataSource);
            const recompense = await recompenseUsecase.buyRecompense(req.body.idUser, recompenseId.id);

            if (recompense === null) {
                res.status(404).send({ "error": `Recompense ${recompenseId.id} not found` });
                return;
            }

            res.status(200).send(recompense);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });
    app.get("/recompenses/user/:id", async (req: Request, res: Response) => {
        try {
            const validationResult = recompenseIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }

            const userId = validationResult.value;

            const recompenseUsecase = new RecompenseUsecase(AppDataSource);
            const recompenses = await recompenseUsecase.listRecompensesByUserId(userId.id);
            if (recompenses === null) {
                res.status(404).send({ "error": `Recompense ${userId} not found` });
                return;
            }
          
          
            res.status(200).send(recompenses);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });
    app.get("/familles/:idFamille/recompenses", async (req: Request, res: Response) => {
        const { idFamille } = req.params;
    
        if (!idFamille || isNaN(Number(idFamille))) {
            res.status(400).send({ error: "Invalid family ID." });
            return;
        }
    
        try {
            const recompenseUsecase = new RecompenseUsecase(AppDataSource);
            const recompenses = await recompenseUsecase.getRecompensesByFamille(Number(idFamille));
            res.status(200).send(recompenses);
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: "Internal error" });
        }
    });
    app.post("/familles/:idFamille/recompenses", async (req: Request, res: Response) => {
        const { idFamille } = req.params;
    
        if (!idFamille || isNaN(Number(idFamille))) {
            res.status(400).send({ error: "Invalid family ID." });
            return;
        }
        const validationResult = createRecompenseValidation.validate(req.body);

       
        if (validationResult.error) {
            res.status(400).send(validationResult.error.details.map(err => err.message));
            return;
        }
    
        try {
            const recompenseUsecase = new RecompenseUsecase(AppDataSource);
    
            const newRecompense = await recompenseUsecase.createRecompenseForFamille(
                Number(idFamille),
                validationResult.value            );
    
            res.status(200).send(newRecompense);
        } catch (error: any) {
            if (error.message === "Famille introuvable.") {
                res.status(404).send({ error: error.message });
            } else {
                console.error(error);
                res.status(500).send({ error: "Erreur interne du serveur." });
            }
        }
    });
    
};