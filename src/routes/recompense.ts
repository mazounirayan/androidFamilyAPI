import express, { Request, Response } from "express";
import { AppDataSource } from "../database/database";
import { RecompenseUsecase } from "../usecases/recompense-usecase";
import { createRecompenseValidation } from "../validators/recompense-validator";

export const RecompenseHandler = (app: express.Express) => {
    const recompenseUsecase = new RecompenseUsecase(AppDataSource);

    // Create a new reward
    app.post("/recompenses", async (req: Request, res: Response) => {
        const validation = createRecompenseValidation.validate(req.body);
        if (validation.error) {
            return res.status(400).send(validation.error.details);
        }

        try {
            const recompense = await recompenseUsecase.createRecompense(validation.value);
            res.status(201).send(recompense);
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: "Internal server error" });
        }
    });

    // Get rewards for a specific user
    app.get("/recompenses/:userId", async (req: Request, res: Response) => {
        try {
            const recompenses = await recompenseUsecase.listRecompenses(+req.params.userId);
            res.status(200).send(recompenses);
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: "Internal server error" });
        }
    });
};
