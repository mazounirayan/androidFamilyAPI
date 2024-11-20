import Joi from "joi";

export const createChatValidation = Joi.object({
    libelle: Joi.string().required().max(255),
});
