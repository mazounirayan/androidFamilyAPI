"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionCoinsHandler = void 0;
const database_1 = require("../database/database");
const transactioncoin_usecase_1 = require("../usecases/transactioncoin-usecase");
const generate_validation_message_1 = require("../validators/generate-validation-message");
const transactioncoins_validator_1 = require("../validators/transactioncoins-validator");
const TransactionCoinsHandler = (app) => {
    app.get("/transactions", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const validation = transactioncoins_validator_1.listTransactionCoinsValidation.validate(req.query);
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const listTransactionCoinsRequest = validation.value;
        let limit = 20;
        if (listTransactionCoinsRequest.limit) {
            limit = listTransactionCoinsRequest.limit;
        }
        const page = (_a = listTransactionCoinsRequest.page) !== null && _a !== void 0 ? _a : 1;
        try {
            const transactionCoinsUsecase = new transactioncoin_usecase_1.TransactionCoinsUsecase(database_1.AppDataSource);
            const listTransactions = yield transactionCoinsUsecase.listTransactions(Object.assign(Object.assign({}, listTransactionCoinsRequest), { page, limit }));
            res.status(200).send(listTransactions);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.post("/transactions", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = transactioncoins_validator_1.createTransactionCoinsValidation.validate(req.body);
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const transactionCoinsRequest = validation.value;
        try {
            const transactionCoinsUsecase = new transactioncoin_usecase_1.TransactionCoinsUsecase(database_1.AppDataSource);
            const transactionCreated = yield transactionCoinsUsecase.createTransaction(transactionCoinsRequest);
            res.status(201).send(transactionCreated);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.delete("/transactions/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = transactioncoins_validator_1.transactionCoinsIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const transactionCoinsId = validationResult.value;
            const transactionCoinsUsecase = new transactioncoin_usecase_1.TransactionCoinsUsecase(database_1.AppDataSource);
            const transaction = yield transactionCoinsUsecase.getTransactionById(transactionCoinsId.id);
            if (transaction === null) {
                res.status(404).send({ "error": `Transaction ${transactionCoinsId.id} not found` });
                return;
            }
            yield transactionCoinsUsecase.deleteTransaction(transactionCoinsId.id);
            res.status(200).send("Transaction supprimée avec succès");
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.get("/transactions/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = transactioncoins_validator_1.transactionCoinsIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const transactionCoinsId = validationResult.value;
            const transactionCoinsUsecase = new transactioncoin_usecase_1.TransactionCoinsUsecase(database_1.AppDataSource);
            const transaction = yield transactionCoinsUsecase.getTransactionById(transactionCoinsId.id);
            if (transaction === null) {
                res.status(404).send({ "error": `Transaction ${transactionCoinsId.id} not found` });
                return;
            }
            res.status(200).send(transaction);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.patch("/transactions/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = transactioncoins_validator_1.updateTransactionCoinsValidation.validate(Object.assign(Object.assign({}, req.params), req.body));
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const updateTransactionCoinsRequest = validationResult.value;
            const transactionCoinsUsecase = new transactioncoin_usecase_1.TransactionCoinsUsecase(database_1.AppDataSource);
            const updatedTransaction = yield transactionCoinsUsecase.updateTransaction(updateTransactionCoinsRequest.id, updateTransactionCoinsRequest);
            if (updatedTransaction === null) {
                res.status(404).send({ "error": `Transaction ${updateTransactionCoinsRequest.id} not found` });
                return;
            }
            res.status(200).send(updatedTransaction);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.get("/transactions/user/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = parseInt(req.params.id, 10);
            const transactionUsecase = new transactioncoin_usecase_1.TransactionCoinsUsecase(database_1.AppDataSource);
            const transactions = yield transactionUsecase.listTransactionsByUserId(userId);
            res.status(200).send(transactions);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
};
exports.TransactionCoinsHandler = TransactionCoinsHandler;
