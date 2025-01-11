import express, { Request, Response } from "express";
import { AppDataSource } from "../database/database";
import { CategorieTacheUsecase  } from "../usecases/CategorieTache-usecase";
import { createCategorieTacheValidation , updateCategorieTacheValidation } from "../validators/CategorieTache-validator";
import { generateValidationErrorMessage } from '../validators/generate-validation-message';

export const CategorieTache = (app: express.Express) => {

    app.get("/categories-tache", async (req: Request, res: Response) => {
        try {
            const categorieUsecase = new CategorieTacheUsecase(AppDataSource);
            const categories = await categorieUsecase.listCategoriesTache();
            res.status(200).send(categories);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });
    app.post("/categories-tache", async (req: Request, res: Response) => {
        try {
            const validation = createCategorieTacheValidation.validate(req.body);
    
            if (validation.error) {
                res.status(400).send(generateValidationErrorMessage(validation.error.details));
                return;
            }
    
            const categorieRequest = validation.value;
            const categorieUsecase = new CategorieTacheUsecase(AppDataSource);
            const categorieCreated = await categorieUsecase.createCategorieTache(categorieRequest);
            res.status(201).send(categorieCreated);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });
    app.get("/categories-tache/:id", async (req: Request, res: Response) => {
        try {
            const categorieId = parseInt(req.params.id, 10);
            const categorieUsecase = new CategorieTacheUsecase(AppDataSource);
            const categorie = await categorieUsecase.getCategorieTacheById(categorieId);
    
            if (!categorie) {
                res.status(404).send({ error: `Category ${categorieId} not found` });
                return;
            }
    
            res.status(200).send(categorie);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });
    app.patch("/categories-tache/:id", async (req: Request, res: Response) => {
        try {
            const validation = updateCategorieTacheValidation.validate({ ...req.params, ...req.body });
    
            if (validation.error) {
                res.status(400).send(generateValidationErrorMessage(validation.error.details));
                return;
            }
    
            const updateRequest = validation.value;
            const categorieUsecase = new CategorieTacheUsecase(AppDataSource);
            const updatedCategorie = await categorieUsecase.updateCategorieTache(updateRequest.id, updateRequest);
    
            if (!updatedCategorie) {
                res.status(404).send({ error: `Category ${updateRequest.id} not found` });
                return;
            }
    
            res.status(200).send(updatedCategorie);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });
    app.delete("/categories-tache/:id", async (req: Request, res: Response) => {
        try {
            const categorieId = parseInt(req.params.id, 10);
            const categorieUsecase = new CategorieTacheUsecase(AppDataSource);
            await categorieUsecase.deleteCategorieTache(categorieId);
    
            res.status(200).send({ message: "Category deleted successfully" });
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });
};
