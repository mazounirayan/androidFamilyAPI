import express, { Request, Response } from 'express';
import { AppDataSource } from '../database/database';
import { TacheUsecase } from '../usecases/tache-usecase';
import { generateValidationErrorMessage } from '../validators/generate-validation-message';
import { listTacheValidation, createTacheValidation, TacheIdValidation, updateTacheValidation } from '../validators/tache-validator';

export const TacheHandler = (app: express.Express) => {

    // Lister les tâches
    app.get("/taches", async (req: Request, res: Response) => {
        const validation = listTacheValidation.validate(req.query);

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }

        const listTacheRequest = validation.value;
        let limit = 20;
        if (listTacheRequest.limit) {
            limit = listTacheRequest.limit;
        }
        const page = listTacheRequest.page ?? 1;

        try {
            const tacheUsecase = new TacheUsecase(AppDataSource);
            const listTaches = await tacheUsecase.listTaches({ ...listTacheRequest, page, limit });
            res.status(200).send(listTaches);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.post("/taches", async (req: Request, res: Response) => {
        const validation = createTacheValidation.validate(req.body);
    
        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }
    
        const tacheRequest = validation.value;
    
        // Convert string dates to Date objects
        if (tacheRequest.date_debut) {
            tacheRequest.date_debut = new Date(tacheRequest.date_debut);
        }
        if (tacheRequest.date_fin) {
            tacheRequest.date_fin = new Date(tacheRequest.date_fin);
        }
    
        try {
            const tacheUsecase = new TacheUsecase(AppDataSource);
            const tacheCreated = await tacheUsecase.createTache(tacheRequest);
            res.status(201).send(tacheCreated);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    // Supprimer une tâche
    app.delete("/taches/:id", async (req: Request, res: Response) => {
        try {
            const validationResult = TacheIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }

            const tacheId = validationResult.value;

            const tacheUsecase = new TacheUsecase(AppDataSource);
            const tache = await tacheUsecase.getTacheById(tacheId.id);

            if (tache === null) {
                res.status(404).send({ "error": `Tache ${tacheId.id} not found` });
                return;
            }

            await tacheUsecase.deleteTache(tacheId.id);
            res.status(200).send("Tache supprimée avec succès");
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    // Obtenir une tâche par son ID
    app.get("/taches/:id", async (req: Request, res: Response) => {
        try {
            const validationResult = TacheIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }

            const tacheId = validationResult.value;

            const tacheUsecase = new TacheUsecase(AppDataSource);
            const tache = await tacheUsecase.getTacheById(tacheId.id);

            if (tache === null) {
                res.status(404).send({ "error": `Tache ${tacheId.id} not found` });
                return;
            }

            res.status(200).send(tache);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    // Mettre à jour une tâche

app.patch("/taches/:id", async (req: Request, res: Response) => {
    try {
        const validationResult = updateTacheValidation.validate({ ...req.params, ...req.body });

        if (validationResult.error) {
            res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
            return;
        }

        const updateTacheRequest = validationResult.value;

        const tacheUsecase = new TacheUsecase(AppDataSource);
        const updatedTache = await tacheUsecase.updateTache(updateTacheRequest.id, updateTacheRequest);

        if (!updatedTache) {
            res.status(404).send({ "error": `Tache ${updateTacheRequest.id} not found` });
            return;
        }

        res.status(200).send(updatedTache);
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: "Internal error" });
    }
});

    // Marquer une tâche comme terminée
    app.post("/taches/:id/complete", async (req: Request, res: Response) => {
        try {
            const validationResult = TacheIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }

            const tacheId = validationResult.value;

            const tacheUsecase = new TacheUsecase(AppDataSource);
            const tache = await tacheUsecase.markTacheAsCompleted(tacheId.id);

            if (tache === null) {
                res.status(404).send({ "error": `Tache ${tacheId.id} not found` });
                return;
            }

            res.status(200).send(tache);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });
    app.get("/taches/user/:id", async (req: Request, res: Response) => {
        try {
            const userId = parseInt(req.params.id, 10);
            const tacheUsecase = new TacheUsecase(AppDataSource);
            const taches = await tacheUsecase.listTachesByUserId(userId);
            res.status(200).send(taches);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.get("/taches/famille/:id", async (req: Request, res: Response) => {
        try {
            const familleId = parseInt(req.params.id, 10);
            const tacheUsecase = new TacheUsecase(AppDataSource);
            const taches = await tacheUsecase.listTachesByFamilleId(familleId);
            res.status(200).send(taches);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });
    app.post("/taches/:id/assign", async (req: Request, res: Response) => {
        try {
        const validationIdUser = updateTacheValidation.validate(req.body);
        const validationResult = TacheIdValidation.validate(req.params);
        if (validationResult.error) {
            res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
            return;
        }
        
            if (validationIdUser.error) {
                res.status(400).send(generateValidationErrorMessage(validationIdUser.error.details));
                return;
            }


            const userId = validationIdUser.value;

            const tache =validationResult.value;
         

            if (!userId) {
                res.status(400).send({ error: "User ID is required" });
                return;
            }
    
            const tacheUsecase = new TacheUsecase(AppDataSource);
            await tacheUsecase.assignTacheToUser(tache.id, userId.idUser!);
    
            res.status(200).send({ message: "Task assigned successfully" });
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });
};