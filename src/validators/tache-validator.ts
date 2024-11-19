import Joi from "joi";

export const createTacheValidation = Joi.object<CreateTacheRequest>({
    nom: Joi.string().max(255).required(),
    date_debut: Joi.date().optional(),
    date_fin: Joi.date().optional(),
    status: Joi.string().max(50).optional(),
    type: Joi.string().max(100).optional(),
    description: Joi.string().optional(),
    idUser: Joi.number().integer().optional(),
    idFamille: Joi.number().integer().optional(),
}).options({ abortEarly: false });

export interface CreateTacheRequest {
    nom: string;
    date_debut?: string; // Format ISO pour les dates
    date_fin?: string;
    status?: string;
    type?: string;
    description?: string;
    idUser?: number;
    idFamille?: number;
}

export const updateTacheValidation = Joi.object<UpdateTacheRequest>({
    idTache: Joi.number().required(),
    nom: Joi.string().max(255).optional(),
    date_debut: Joi.date().optional(),
    date_fin: Joi.date().optional(),
    status: Joi.string().max(50).optional(),
    type: Joi.string().max(100).optional(),
    description: Joi.string().optional(),
    idUser: Joi.number().integer().optional(),
    idFamille: Joi.number().integer().optional(),
}).options({ abortEarly: false });

export interface UpdateTacheRequest {
    idTache: number;
    nom?: string;
    date_debut?: Date;
    date_fin?: Date;
    status?: string;
    type?: string;
    description?: string;
    idUser?: number;
    idFamille?: number;
}

export const listTacheValidation = Joi.object<ListTacheRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    status: Joi.string().optional(),
    type: Joi.string().optional(),
    idFamille: Joi.number().integer().optional(),
}).options({ abortEarly: false });

export interface ListTacheRequest {
    page?: number;
    limit?: number;
    status?: string;
    type?: string;
    idFamille?: number;
    nom?:string;
}
export const TacheIdValidation = Joi.object<TacheIdRequest>({
    id: Joi.number().required(),
});
export interface TacheIdRequest {
    id: number
}