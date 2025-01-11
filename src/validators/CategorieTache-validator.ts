import Joi from 'joi';

export const createCategorieTacheValidation = Joi.object({
    nom: Joi.string().required().max(255).messages({
        'string.empty': 'Le nom de la catégorie est requis',
        'string.max': 'Le nom de la catégorie ne doit pas dépasser 255 caractères',
    }),
});


export const updateCategorieTacheValidation = Joi.object({
    id: Joi.number().required().messages({
        'number.base': 'L\'ID de la catégorie doit être un nombre',
        'any.required': 'L\'ID de la catégorie est requis',
    }),
    nom: Joi.string().max(255).messages({
        'string.max': 'Le nom de la catégorie ne doit pas dépasser 255 caractères',
    }),
}).min(1);
export const categorieTacheIdValidation = Joi.object({
    id: Joi.number().required().messages({
        'number.base': 'L\'ID de la catégorie doit être un nombre',
        'any.required': 'L\'ID de la catégorie est requis',
    }),
});
export const listCategorieTacheValidation = Joi.object({
    page: Joi.number().min(1).messages({
        'number.base': 'La page doit être un nombre',
        'number.min': 'La page doit être supérieure ou égale à 1',
    }),
    limit: Joi.number().min(1).max(100).messages({
        'number.base': 'La limite doit être un nombre',
        'number.min': 'La limite doit être supérieure ou égale à 1',
        'number.max': 'La limite ne doit pas dépasser 100',
    }),
});