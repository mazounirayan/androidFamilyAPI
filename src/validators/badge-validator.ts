import Joi from 'joi';

// Valider les paramètres de requête pour lister les badges
export const listBadgeValidation = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
});

// Valider les données pour créer un badge
export const createBadgeValidation = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().optional(),
    imageUrl: Joi.string().uri().optional(),
});

// Valider l'ID d'un badge
export const badgeIdValidation = Joi.object({
    id: Joi.number().integer().min(1).required(),
});

// Valider les données pour mettre à jour un badge
export const updateBadgeValidation = Joi.object({
    id: Joi.number().integer().min(1).required(),
    name: Joi.string().optional(),
    description: Joi.string().optional(),
    imageUrl: Joi.string().uri().optional(),
});