import Joi from "joi";

export const createRecompenseValidation = Joi.object({
    coin: Joi.number().integer().positive().required(),
    idUser: Joi.number().integer().positive().required(),
});
