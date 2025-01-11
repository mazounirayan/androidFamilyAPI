"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listTransactionCoinsValidation = exports.createTransactionCoinsValidation = exports.transactionCoinsIdValidation = exports.updateTransactionCoinsValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.updateTransactionCoinsValidation = joi_1.default.object({
    id: joi_1.default.number().integer().min(1).required(),
    montant: joi_1.default.number().integer().min(0).optional(),
    type: joi_1.default.string().valid("Gain", "Depense").optional(),
    description: joi_1.default.string().optional(),
    idUser: joi_1.default.number().integer().min(1).optional(),
});
exports.transactionCoinsIdValidation = joi_1.default.object({
    id: joi_1.default.number().integer().min(1).required(),
});
exports.createTransactionCoinsValidation = joi_1.default.object({
    montant: joi_1.default.number().integer().min(0).required(),
    type: joi_1.default.string().valid("Gain", "Depense").required(),
    description: joi_1.default.string().optional(),
    idUser: joi_1.default.number().integer().min(1).required(),
});
exports.listTransactionCoinsValidation = joi_1.default.object({
    page: joi_1.default.number().integer().min(1).default(1),
    limit: joi_1.default.number().integer().min(1).max(100).default(20),
    idUser: joi_1.default.number().integer().min(1).optional(),
    type: joi_1.default.string().optional(),
});
