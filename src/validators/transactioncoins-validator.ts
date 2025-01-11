import Joi from "joi";
 


export const updateTransactionCoinsValidation = Joi.object({
    id: Joi.number().integer().min(1).required(),
    montant: Joi.number().integer().min(0).optional(),
    type: Joi.string().valid("Gain", "Depense").optional(),
    description: Joi.string().optional(),
    idUser: Joi.number().integer().min(1).optional(),
});
export const transactionCoinsIdValidation = Joi.object({
    id: Joi.number().integer().min(1).required(),
});
export const createTransactionCoinsValidation = Joi.object({
    montant: Joi.number().integer().min(0).required(),
    type: Joi.string().valid("Gain", "Depense").required(),
    description: Joi.string().optional(),
    idUser: Joi.number().integer().min(1).required(),
});
export const listTransactionCoinsValidation = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    idUser: Joi.number().integer().min(1).optional(),
    type: Joi.string().optional(),
});