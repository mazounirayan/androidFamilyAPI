"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUserValidation = exports.listUserValidation = exports.updateUserValidation = exports.userTokenValidation = exports.userIdValidation = exports.createUserValidation = void 0;
const joi_1 = __importDefault(require("joi"));
// Create User Validation
exports.createUserValidation = joi_1.default.object({
    nom: joi_1.default.string()
        .required()
        .messages({
        'string.empty': 'Le nom est obligatoire.',
    }),
    prenom: joi_1.default.string()
        .required()
        .messages({
        'string.empty': 'Le prénom est obligatoire.',
    }),
    email: joi_1.default.string()
        .email()
        .required()
        .messages({
        'string.empty': 'L’email est obligatoire.',
        'string.email': 'L’email doit être valide.',
    }),
    motDePasse: joi_1.default.string()
        .required()
        .messages({
        'string.empty': 'Le mot de passe est obligatoire.',
        'string.min': 'Le mot de passe doit contenir au moins 8 caractères.',
    }),
    numTel: joi_1.default.string()
        .length(10)
        .pattern(/^[0-9]+$/)
        .optional()
        .messages({
        'string.length': 'Le numéro de téléphone doit contenir exactement 10 chiffres.',
        'string.pattern.base': 'Le numéro de téléphone ne doit contenir que des chiffres.',
    }),
    role: joi_1.default.string()
        .valid('Parent', 'Enfant')
        .required()
        .messages({
        'any.only': 'Le rôle doit être soit "Parent" soit "Enfant".',
        'string.empty': 'Le rôle est obligatoire.',
    }),
    codeFamille: joi_1.default.string()
        .optional()
        .messages({
        'string.empty': 'Le code famille ne peut pas être vide.',
    }),
    nomFamille: joi_1.default.string()
        .optional()
        .messages({
        'string.empty': 'Le nom de la famille ne peut pas être vide.',
    }),
})
    .options({ abortEarly: false });
// User ID Validation
exports.userIdValidation = joi_1.default.object({
    id: joi_1.default.number().required(),
});
exports.userTokenValidation = joi_1.default.object({
    token: joi_1.default.string().required(),
});
// Update User Validation
exports.updateUserValidation = joi_1.default.object({
    id: joi_1.default.number().required(),
    nom: joi_1.default.string().optional(),
    prenom: joi_1.default.string().optional(),
    email: joi_1.default.string().email().optional(),
    numTel: joi_1.default.string().min(10).max(10).optional(),
    motDePasse: joi_1.default.string().optional(),
    role: joi_1.default.string()
        .valid('Parent', 'Enfant') // Use ...Object.values(UserRole) if UserRole is an enum
        .optional(),
});
// List User Validation
exports.listUserValidation = joi_1.default.object({
    page: joi_1.default.number().min(1).optional(),
    limit: joi_1.default.number().min(1).optional(),
    nom: joi_1.default.string().optional(),
    prenom: joi_1.default.string().optional(),
    numTel: joi_1.default.string().min(10).max(10).optional(),
    email: joi_1.default.string().email().optional(),
    role: joi_1.default.string()
        .valid('Parent', 'Enfant') // Use ...Object.values(UserRole) if UserRole is an enum
        .optional(),
});
// Login User Validation
exports.LoginUserValidation = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    motDePasse: joi_1.default.string().required(),
}).options({ abortEarly: false });
