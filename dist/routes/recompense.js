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
exports.RecompenseHandler = void 0;
const database_1 = require("../database/database");
const recompense_usecase_1 = require("../usecases/recompense-usecase");
const recompense_validator_1 = require("../validators/recompense-validator");
const RecompenseHandler = (app) => {
    const recompenseUsecase = new recompense_usecase_1.RecompenseUsecase(database_1.AppDataSource);
    // Create a new reward
    app.post("/recompenses", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = recompense_validator_1.createRecompenseValidation.validate(req.body);
        if (validation.error) {
            return res.status(400).send(validation.error.details);
        }
        try {
            const recompense = yield recompenseUsecase.createRecompense(validation.value);
            res.status(201).send(recompense);
        }
        catch (error) {
            console.error(error);
            res.status(500).send({ error: "Internal server error" });
        }
    }));
    // Get rewards for a specific user
    app.get("/recompenses/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const recompenses = yield recompenseUsecase.listRecompenses(+req.params.userId);
            res.status(200).send(recompenses);
        }
        catch (error) {
            console.error(error);
            res.status(500).send({ error: "Internal server error" });
        }
    }));
};
exports.RecompenseHandler = RecompenseHandler;
