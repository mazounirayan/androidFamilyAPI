"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TacheIdValidation = exports.listTacheValidation = exports.updateTacheValidation = exports.createTacheValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createTacheValidation = joi_1.default.object({
    nom: joi_1.default.string().max(255).required(),
    date_debut: joi_1.default.date().iso().optional(), // Ensure the date is in ISO format
    date_fin: joi_1.default.date().iso().optional(), // Ensure the date is in ISO format
    status: joi_1.default.string().max(50).optional(),
    type: joi_1.default.string().max(100).optional(),
    description: joi_1.default.string().optional(),
    idUser: joi_1.default.number().integer().optional(),
    idFamille: joi_1.default.number().integer().optional(),
}).options({ abortEarly: false });
exports.updateTacheValidation = joi_1.default.object({
    id: joi_1.default.number().required(),
    nom: joi_1.default.string().max(255).optional(),
    date_debut: joi_1.default.date().optional(),
    date_fin: joi_1.default.date().optional(),
    status: joi_1.default.string().max(50).optional(),
    type: joi_1.default.string().max(100).optional(),
    description: joi_1.default.string().optional(),
    idUser: joi_1.default.number().integer().optional(),
    idFamille: joi_1.default.number().integer().optional(),
}).options({ abortEarly: false });
exports.listTacheValidation = joi_1.default.object({
    page: joi_1.default.number().min(1).optional(),
    limit: joi_1.default.number().min(1).optional(),
    status: joi_1.default.string().optional(),
    type: joi_1.default.string().optional(),
    idFamille: joi_1.default.number().integer().optional(),
}).options({ abortEarly: false });
// tache-validator.ts
exports.TacheIdValidation = joi_1.default.object({
    id: joi_1.default.number().required(),
}).options({ abortEarly: false });
