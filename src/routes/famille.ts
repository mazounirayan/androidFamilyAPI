import express, { Request, Response } from "express";
import { AppDataSource } from "../database/database";
import { Famille } from "../database/entities/famille";
import { createFamilleValidation, FamilleIdValidation } from "../validators/famille-validator";
import { updateFamilleValidation } from "../validators/famille-validator";

export const FamilleHandler = (app: express.Express) => {
    // Créer une nouvelle famille
    app.post("/familles", async (req: Request, res: Response) => {
        const validation = createFamilleValidation.validate(req.body);

        if (validation.error) {
            res.status(400).send({ error: validation.error.details });
            return;
        }

        const familleRepo = AppDataSource.getRepository(Famille);
        const familleData = validation.value;

        try {
            const newFamille = familleRepo.create(familleData);
            const savedFamille = await familleRepo.save(newFamille);
            res.status(201).send(savedFamille);
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: "Internal server error" });
        }
    });

    // Récupérer une famille par ID
    app.get("/familles/:id", async (req: Request, res: Response) => {
        const validation = FamilleIdValidation.validate(req.params);

        if (validation.error) {
            res.status(400).send({ error: validation.error.details });
            return;
        }

        const familleRepo = AppDataSource.getRepository(Famille);
        const { id } = validation.value;

        try {
            const famille = await familleRepo.findOneBy({ idFamille: id });

            if (!famille) {
                res.status(404).send({ error: "Famille not found" });
                return;
            }

            res.status(200).send(famille);
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: "Internal server error" });
        }
    });

    // Lister toutes les familles
    app.get("/familles", async (_req: Request, res: Response) => {
        const familleRepo = AppDataSource.getRepository(Famille);

        try {
            const familles = await familleRepo.find();
            res.status(200).send(familles);
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: "Internal server error" });
        }
    });

    // Supprimer une famille par ID
    app.delete("/familles/:id", async (req: Request, res: Response) => {
        const validation = FamilleIdValidation.validate(req.params);

        if (validation.error) {
            res.status(400).send({ error: validation.error.details });
            return;
        }

        const familleRepo = AppDataSource.getRepository(Famille);
        const { id } = validation.value;

        try {
            const famille = await familleRepo.findOneBy({ idFamille: id });

            if (!famille) {
                res.status(404).send({ error: "Famille not found" });
                return;
            }

            await familleRepo.remove(famille);
            res.status(200).send({ message: "Famille deleted successfully" });
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: "Internal server error" });
        }
    });
    app.put("/familles/:id", async (req: Request, res: Response) => {
        const validation = updateFamilleValidation.validate({ id: req.params.id, ...req.body });
    
        if (validation.error) {
            res.status(400).send({ error: validation.error.details });
            return;
        }
    
        const familleRepo = AppDataSource.getRepository(Famille);
        const { id, nom } = validation.value;
    
        try {
            const famille = await familleRepo.findOneBy({ idFamille: id });
    
            if (!famille) {
                res.status(404).send({ error: "Famille not found" });
                return;
            }
    
            if (nom) famille.nom = nom;
    
            const updatedFamille = await familleRepo.save(famille);
            res.status(200).send(updatedFamille);
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: "Internal server error" });
        }
    });
    
};
