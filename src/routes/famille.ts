import express, { Request, Response } from 'express';
import { AppDataSource } from '../database/database';
import { FamilleUsecase } from '../usecases/famille-usecase';
import { generateValidationErrorMessage } from '../validators/generate-validation-message';
import { listFamilleValidation, createFamilleValidation, FamilleIdValidation, updateFamilleValidation } from '../validators/famille-validator';

export const FamilleHandler = (app: express.Express) => {

    app.get("/familles", async (req: Request, res: Response) => {
        const validation = listFamilleValidation.validate(req.query);

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }

        const listFamilleRequest = validation.value;
        let limit = 20;
        if (listFamilleRequest.limit) {
            limit = listFamilleRequest.limit;
        }
        const page = listFamilleRequest.page ?? 1;

        try {
            const familleUsecase = new FamilleUsecase(AppDataSource);
            const listFamilles = await familleUsecase.listFamilles({ ...listFamilleRequest, page, limit });
            res.status(200).send(listFamilles);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.post("/familles", async (req: Request, res: Response) => {
        const validation = createFamilleValidation.validate(req.body);

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }

        const familleRequest = validation.value;

        try {
            const familleUsecase = new FamilleUsecase(AppDataSource);
            const familleCreated = await familleUsecase.createFamille(familleRequest);
            res.status(201).send(familleCreated);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.delete("/familles/:id", async (req: Request, res: Response) => {
        try {
            const validationResult = FamilleIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }

            const familleId = validationResult.value;

            const familleUsecase = new FamilleUsecase(AppDataSource);
            const famille = await familleUsecase.getFamilleById(familleId.id);

            if (famille === null) {
                res.status(404).send({ "error": `Famille ${familleId.id} not found` });
                return;
            }

            await familleUsecase.deleteFamille(familleId.id);
            res.status(200).send("Famille supprimée avec succès");
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.get("/familles/:id", async (req: Request, res: Response) => {
        try {
            const validationResult = FamilleIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }

            const familleId = validationResult.value;

            const familleUsecase = new FamilleUsecase(AppDataSource);
            const famille = await familleUsecase.getFamilleById(familleId.id);

            if (famille === null) {
                res.status(404).send({ "error": `Famille ${familleId.id} not found` });
                return;
            }

            res.status(200).send(famille);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

 
app.patch("/familles/:id", async (req: Request, res: Response) => {
    try {
        const validationResult = updateFamilleValidation.validate(req.body);

        if (validationResult.error) {
            res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
            return;
        }

        const updateFamilleRequest = validationResult.value;

        const familleUsecase = new FamilleUsecase(AppDataSource);
        const updatedFamille = await familleUsecase.updateFamille(updateFamilleRequest.id, updateFamilleRequest);

        if (!updatedFamille) {
            res.status(404).send({ "error": `Famille ${updateFamilleRequest.id} not found` });
            return;
        }

        res.status(200).send(updatedFamille);
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: "Internal error" });
    }
});

};