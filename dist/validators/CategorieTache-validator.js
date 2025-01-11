"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCategorieTacheValidation = exports.categorieTacheIdValidation = exports.updateCategorieTacheValidation = exports.createCategorieTacheValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createCategorieTacheValidation = joi_1.default.object({
    nom: joi_1.default.string().required().max(255).messages({
        'string.empty': 'Le nom de la catégorie est requis',
        'string.max': 'Le nom de la catégorie ne doit pas dépasser 255 caractères',
    }),
});
exports.updateCategorieTacheValidation = joi_1.default.object({
    id: joi_1.default.number().required().messages({
        'number.base': 'L\'ID de la catégorie doit être un nombre',
        'any.required': 'L\'ID de la catégorie est requis',
    }),
    nom: joi_1.default.string().max(255).messages({
        'string.max': 'Le nom de la catégorie ne doit pas dépasser 255 caractères',
    }),
}).min(1);
exports.categorieTacheIdValidation = joi_1.default.object({
    id: joi_1.default.number().required().messages({
        'number.base': 'L\'ID de la catégorie doit être un nombre',
        'any.required': 'L\'ID de la catégorie est requis',
    }),
});
exports.listCategorieTacheValidation = joi_1.default.object({
    page: joi_1.default.number().min(1).messages({
        'number.base': 'La page doit être un nombre',
        'number.min': 'La page doit être supérieure ou égale à 1',
    }),
    limit: joi_1.default.number().min(1).max(100).messages({
        'number.base': 'La limite doit être un nombre',
        'number.min': 'La limite doit être supérieure ou égale à 1',
        'number.max': 'La limite ne doit pas dépasser 100',
    }),
});
