"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBadgeValidation = exports.badgeIdValidation = exports.createBadgeValidation = exports.listBadgeValidation = void 0;
const joi_1 = __importDefault(require("joi"));
// Valider les paramètres de requête pour lister les badges
exports.listBadgeValidation = joi_1.default.object({
    page: joi_1.default.number().integer().min(1).default(1),
    limit: joi_1.default.number().integer().min(1).max(100).default(20),
});
// Valider les données pour créer un badge
exports.createBadgeValidation = joi_1.default.object({
    name: joi_1.default.string().required(),
    description: joi_1.default.string().optional(),
    imageUrl: joi_1.default.string().uri().optional(),
});
// Valider l'ID d'un badge
exports.badgeIdValidation = joi_1.default.object({
    id: joi_1.default.number().integer().min(1).required(),
});
// Valider les données pour mettre à jour un badge
exports.updateBadgeValidation = joi_1.default.object({
    id: joi_1.default.number().integer().min(1).required(),
    name: joi_1.default.string().optional(),
    description: joi_1.default.string().optional(),
    imageUrl: joi_1.default.string().uri().optional(),
});
