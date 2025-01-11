"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRecompenseValidation = exports.recompenseIdValidation = exports.createRecompenseValidation = exports.listRecompenseValidation = void 0;
const joi_1 = __importDefault(require("joi"));
// Valider les paramètres de requête pour lister les récompenses
exports.listRecompenseValidation = joi_1.default.object({
    page: joi_1.default.number().integer().min(1).default(1),
    limit: joi_1.default.number().integer().min(1).max(100).default(20),
});
// Valider les données pour créer une récompense
exports.createRecompenseValidation = joi_1.default.object({
    nom: joi_1.default.string().required(),
    description: joi_1.default.string().optional(),
    cout: joi_1.default.number().integer().min(0).required(),
    stock: joi_1.default.number().integer().min(0).required(),
    estDisponible: joi_1.default.boolean().default(true),
});
// Valider l'ID d'une récompense
exports.recompenseIdValidation = joi_1.default.object({
    id: joi_1.default.number().integer().min(1).required(),
});
// Valider les données pour mettre à jour une récompense
exports.updateRecompenseValidation = joi_1.default.object({
    id: joi_1.default.number().integer().min(1).required(),
    nom: joi_1.default.string().optional(),
    description: joi_1.default.string().optional(),
    cout: joi_1.default.number().integer().min(0).optional(),
    stock: joi_1.default.number().integer().min(0).optional(),
    estDisponible: joi_1.default.boolean().optional(),
});
