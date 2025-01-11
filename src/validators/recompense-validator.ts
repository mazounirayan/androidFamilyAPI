import Joi from 'joi';

// Valider les paramètres de requête pour lister les récompenses
export const listRecompenseValidation = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
});

// Valider les données pour créer une récompense
export const createRecompenseValidation = Joi.object({
    nom: Joi.string().required(),
    description: Joi.string().optional(),
    cout: Joi.number().integer().min(0).required(),
    stock: Joi.number().integer().min(0).required(),
    estDisponible: Joi.boolean().default(true),
});

// Valider l'ID d'une récompense
export const recompenseIdValidation = Joi.object({
    id: Joi.number().integer().min(1).required(),
});

// Valider les données pour mettre à jour une récompense
export const updateRecompenseValidation = Joi.object({
    id: Joi.number().integer().min(1).required(),
    nom: Joi.string().optional(),
    description: Joi.string().optional(),
    cout: Joi.number().integer().min(0).optional(),
    stock: Joi.number().integer().min(0).optional(),
    estDisponible: Joi.boolean().optional(),
});