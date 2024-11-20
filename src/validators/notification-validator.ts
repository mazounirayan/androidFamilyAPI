import Joi from "joi";

export const createNotificationValidation = Joi.object({
    message: Joi.string().required(),
    date_envoie: Joi.date().required(),
    isVue: Joi.boolean().default(false),
    idUser: Joi.number().required(),
    idTache: Joi.number().required(),
});

export const updateNotificationValidation = Joi.object({
    idNotification: Joi.number().required(),
    isVue: Joi.boolean().optional(),
});
