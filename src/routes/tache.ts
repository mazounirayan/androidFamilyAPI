import express, { Request, Response } from "express";
import { AppDataSource } from "../database/database";
import { TacheUsecase } from "../usecases/tache-usecase";
import { createTacheValidation, updateTacheValidation, TacheIdValidation, listTacheValidation } from "../validators/tache-validator";
import { Tache } from "../database/entities/tache";
import { generateValidationErrorMessage } from "../validators/generate-validation-message";

export const TacheHandler = (app: express.Express) => {
    const tacheUsecase = new TacheUsecase(AppDataSource);

    // Créer une nouvelle tâche
    app.post("/taches", async (req: Request, res: Response) => {

        const validation = createTacheValidation.validate(req.body);

        if (validation.error) {
            res.status(400).send({ error: validation.error.details });
            return;
        }
     
    
        const tacheRequest= validation.value;

        const TacheRepo = AppDataSource.getRepository(Tache);

        try {
            const userCreated = await TacheRepo.save(tacheRequest);
            res.status(201).send(userCreated);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }


    });

    // Récupérer une tâche par ID
    app.get("/taches/:idTache", async (req: Request, res: Response) => {
        const validation = TacheIdValidation.validate(req.params);

        if (validation.error) {
            res.status(400).send({ error: validation.error.details });
            return;
        }

        const { id } = validation.value;

        try {
            const tache = await tacheUsecase.getTacheById(id);

            if (!tache) {
                res.status(404).send({ error: "Tache not found" });
                return;
            }

            res.status(200).send(tache);
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: "Internal server error" });
        }
    });

    // Lister toutes les tâches (avec filtrage et pagination)
    app.get("/taches", async (req: Request, res: Response) => {
        const validation = listTacheValidation.validate(req.query);

        if (validation.error) {
            return res.status(400).json({ 
                error: "Invalid filters", 
                details: validation.error.details 
            });
        }

        const { page, limit, status, type, nom } = validation.value;
        const filters = { 
            page, 
            limit, 
            status, 
            type, 
            nom: nom ? `%${nom}%` : undefined 
        };

        const taches = await tacheUsecase.listTaches(filters);
        res.status(200).json(taches);
    });

    // Mettre à jour une tâche
    app.patch("/taches/:idTache", async (req: Request, res: Response) => {
        try {
            const validationResult = updateTacheValidation.validate({ ...req.params, ...req.body });

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }
    
            const tacheUsecase = new TacheUsecase(AppDataSource);

            if(await tacheUsecase.verifTache(+req.params.id) === false){
                res.status(400).send({ "error": `Bad user` });
                return;
            } 
            const updateTacheRequest = validationResult.value;

            const updatedTache = await tacheUsecase.updateTache(
                updateTacheRequest.idTache,
                { ...updateTacheRequest }
            );


            if (updatedTache === null) {
                res.status(404).send({ "error": `User ${updateTacheRequest.idTache} not found` });
                return;
            }

            if (updatedTache === "No changes") {
                res.status(400).send({ "error": `No update provided` });
                return;
            }



            res.status(200).send(updatedTache);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    // Supprimer une tâche par ID
    app.delete("/taches/:id", async (req: Request, res: Response) => {
        const validation = TacheIdValidation.validate(req.params);

        if (validation.error) {
            res.status(400).send({ error: validation.error.details });
            return;
        }

        const { id } = validation.value;

        try {
            await tacheUsecase.deleteTache(id);
            res.status(200).send({ message: "Tache deleted successfully" });
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: "Internal server error" });
        }
    });
};
