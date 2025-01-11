import Joi from "joi";

export const createNotificationValidation = Joi.object({
    message: Joi.string().required(),
    date_envoie: Joi.date().required(),
    isVue: Joi.boolean().default(false),
    idUser: Joi.number().required(),
    idTache: Joi.number().required(),
});


export const listNotificationValidation = Joi.object({
    page: Joi.number().integer().min(1).default(1), // Page actuelle, par défaut 1
    limit: Joi.number().integer().min(1).max(100).default(20), // Limite par page, par défaut 20
    idUser: Joi.number().integer().min(1).optional(), // Filtre par utilisateur (optionnel)
    isVue: Joi.boolean().optional(), // Filtre par statut "vu" (optionnel)
});
export const notificationIdValidation = Joi.object({
    id: Joi.number().integer().min(1).required(), // ID de la notification (obligatoire)
});
export const updateNotificationValidation = Joi.object({
   // idNotification: Joi.number().integer().min(1).required(), // ID de la notification (obligatoire)
    message: Joi.string().optional(), // Message (optionnel)
    date_envoie: Joi.date().optional(), // Date d'envoi (optionnel)
    isVue: Joi.boolean().optional(), // Statut "vu" (optionnel)
    idUser: Joi.number().integer().min(1).optional(), // ID de l'utilisateur (optionnel)
    idTache: Joi.number().integer().min(1).optional(), // ID de la tâche (optionnel)
});
export const markAsViewedValidation = Joi.object({
    idNotification: Joi.number().integer().min(1).required(), // ID de la notification (obligatoire)
});