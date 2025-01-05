"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUserValidation = exports.listUserValidation = exports.updateUserValidation = exports.userIdValidation = exports.createUserValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const user_1 = require("../database/entities/user");
exports.createUserValidation = joi_1.default.object({
    nom: joi_1.default.string().required(),
    prenom: joi_1.default.string().required(),
    email: joi_1.default.string().email().required().messages({
        'string.empty': 'L’email est obligatoire.',
        'string.email': 'L’email doit être valide.',
    }),
    motDePasse: joi_1.default.string().required(),
    numTel: joi_1.default.string().min(10).max(10),
    role: joi_1.default.string().valid('Parent', 'Enfant')
        .required()
        .messages({
        'any.only': 'Le rôle doit être soit "Parent" soit "Enfant".',
    }),
}).options({ abortEarly: false });
exports.userIdValidation = joi_1.default.object({
    id: joi_1.default.number().required(),
    token: joi_1.default.string().required()
});
exports.updateUserValidation = joi_1.default.object({
    id: joi_1.default.number().required(),
    token: joi_1.default.string().required(),
    nom: joi_1.default.string().optional(),
    prenom: joi_1.default.string().optional(),
    email: joi_1.default.string().email().optional(),
    numTel: joi_1.default.string().min(10).max(10).optional(),
    motDePasse: joi_1.default.string().optional(),
    role: joi_1.default.string().valid(...Object.values(user_1.UserRole)).optional(),
});
exports.listUserValidation = joi_1.default.object({
    page: joi_1.default.number().min(1).optional(),
    limit: joi_1.default.number().min(1).optional(),
    nom: joi_1.default.string().optional(),
    prenom: joi_1.default.string().optional(),
    numTel: joi_1.default.string().min(10).max(10).optional(),
    email: joi_1.default.string().email().optional(),
    role: joi_1.default.string().valid(...Object.values(user_1.UserRole)).optional(),
});
exports.LoginUserValidation = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    motDePasse: joi_1.default.string().required(),
}).options({ abortEarly: false });
