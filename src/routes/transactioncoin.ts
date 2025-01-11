import express, { Request, Response } from 'express';
import { AppDataSource } from '../database/database';
import { TransactionCoins } from '../database/entities/transactionCoins';
import { TransactionCoinsUsecase } from '../usecases/transactioncoin-usecase';
import { generateValidationErrorMessage } from '../validators/generate-validation-message';
import { listTransactionCoinsValidation, createTransactionCoinsValidation, transactionCoinsIdValidation, updateTransactionCoinsValidation } from '../validators/transactioncoins-validator';

export const TransactionCoinsHandler = (app: express.Express) => {

    app.get("/transactions", async (req: Request, res: Response) => {
        const validation = listTransactionCoinsValidation.validate(req.query);

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }

        const listTransactionCoinsRequest = validation.value;
        let limit = 20;
        if (listTransactionCoinsRequest.limit) {
            limit = listTransactionCoinsRequest.limit;
        }
        const page = listTransactionCoinsRequest.page ?? 1;

        try {
            const transactionCoinsUsecase = new TransactionCoinsUsecase(AppDataSource);
            const listTransactions = await transactionCoinsUsecase.listTransactions({ ...listTransactionCoinsRequest, page, limit });
            res.status(200).send(listTransactions);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.post("/transactions", async (req: Request, res: Response) => {
        const validation = createTransactionCoinsValidation.validate(req.body);

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }

        const transactionCoinsRequest = validation.value;

        try {
            const transactionCoinsUsecase = new TransactionCoinsUsecase(AppDataSource);
            const transactionCreated = await transactionCoinsUsecase.createTransaction(transactionCoinsRequest);
            res.status(201).send(transactionCreated);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.delete("/transactions/:id", async (req: Request, res: Response) => {
        try {
            const validationResult = transactionCoinsIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }

            const transactionCoinsId = validationResult.value;

            const transactionCoinsUsecase = new TransactionCoinsUsecase(AppDataSource);
            const transaction = await transactionCoinsUsecase.getTransactionById(transactionCoinsId.id);

            if (transaction === null) {
                res.status(404).send({ "error": `Transaction ${transactionCoinsId.id} not found` });
                return;
            }

            await transactionCoinsUsecase.deleteTransaction(transactionCoinsId.id);
            res.status(200).send("Transaction supprimée avec succès");
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.get("/transactions/:id", async (req: Request, res: Response) => {
        try {
            const validationResult = transactionCoinsIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }

            const transactionCoinsId = validationResult.value;

            const transactionCoinsUsecase = new TransactionCoinsUsecase(AppDataSource);
            const transaction = await transactionCoinsUsecase.getTransactionById(transactionCoinsId.id);

            if (transaction === null) {
                res.status(404).send({ "error": `Transaction ${transactionCoinsId.id} not found` });
                return;
            }

            res.status(200).send(transaction);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.patch("/transactions/:id", async (req: Request, res: Response) => {
        try {
            const validationResult = updateTransactionCoinsValidation.validate({ ...req.params, ...req.body });

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }

            const updateTransactionCoinsRequest = validationResult.value;

            const transactionCoinsUsecase = new TransactionCoinsUsecase(AppDataSource);
            const updatedTransaction = await transactionCoinsUsecase.updateTransaction(updateTransactionCoinsRequest.id, updateTransactionCoinsRequest);

            if (updatedTransaction === null) {
                res.status(404).send({ "error": `Transaction ${updateTransactionCoinsRequest.id} not found` });
                return;
            }

            res.status(200).send(updatedTransaction);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });
};