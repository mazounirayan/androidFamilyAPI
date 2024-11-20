import Joi from "joi";

export const createMessageValidation = Joi.object({
    contenu: Joi.string().min(1).required(),
    date_envoie: Joi.date().required(),
    isVue: Joi.boolean().default(false),
    idUser: Joi.number().integer().positive().required(),
    idChat: Joi.number().integer().positive().required(),
});
