import express, { Request, Response } from 'express';
import { AppDataSource } from '../database/database';
import { TacheUsecase } from '../usecases/tache-usecase';
import { generateValidationErrorMessage } from '../validators/generate-validation-message';
import { listTacheValidation, createTacheValidation, TacheIdValidation, updateTacheValidation } from '../validators/tache-validator';
import { User } from '../database/entities/user';
import { Famille } from '../database/entities/famille';
import { UserUsecase } from '../usecases/user-usecase';

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
            const listTaches = await tacheUsecase.listTaches();
            res.status(200).send(listTaches);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.post("/taches", async (req: Request, res: Response) => {
        const validation = createTacheValidation.validate(req.body);
        
        if (validation.error) {
            return res.status(400).json({
                error: generateValidationErrorMessage(validation.error.details)
            });
        }
        
        const tacheRequest = validation.value;
        
        // Conversion des dates en objets Date
        if (tacheRequest.date_debut) {
            tacheRequest.date_debut = new Date(tacheRequest.date_debut);
        }
        if (tacheRequest.date_fin) {
            tacheRequest.date_fin = new Date(tacheRequest.date_fin);
        }
        
        try {
            const tacheUsecase = new TacheUsecase(AppDataSource);
            
            // Vérification des relations
            const [user, famille] = await Promise.all([
                tacheRequest.idUser ? 
                    AppDataSource.getRepository(User).findOneBy({ id: tacheRequest.idUser }) : 
                    null,
                tacheRequest.idFamille ? 
                    AppDataSource.getRepository(Famille).findOneBy({ idFamille: tacheRequest.idFamille }) : 
                    null
            ]);
    
            if (tacheRequest.idUser && !user) {
                return res.status(404).json({
                    error: `Utilisateur avec l'id ${tacheRequest.idUser} introuvable.`
                });
            }
    
            if (tacheRequest.idFamille && !famille) {
                return res.status(404).json({
                    error: `Famille avec l'id ${tacheRequest.idFamille} introuvable.`
                });
            }
    
            const tacheCreated = await tacheUsecase.createTache({
                ...tacheRequest,
                user: user || undefined,  // Conversion explicite de null en undefined
                famille: famille || undefined  // Même chose pour famille
            });
            return res.status(201).json(tacheCreated);
        } catch (error) {
            console.error('Erreur lors de la création de la tâche:', error);
            return res.status(500).json({
                error: "Erreur interne du serveur."
            });
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

app.patch("/taches/:idTache", async (req: Request, res: Response) => {
    try {
        const validationResult = updateTacheValidation.validate({ ...req.params, ...req.body });

        if (validationResult.error) {
            res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
            return;
        }

        const updateTacheRequest = validationResult.value;

        const tacheUsecase = new TacheUsecase(AppDataSource);
        const updatedTache = await tacheUsecase.updateTache(updateTacheRequest.idTache, updateTacheRequest);

        if (!updatedTache) {
            res.status(404).send({ "error": `Tache ${updateTacheRequest.idTache} not found` });
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