import express, { Request, Response } from 'express';
import { AppDataSource } from '../../database/database';
import { UserUsecase } from '../../usecases/user-usecase';
import { generateValidationErrorMessage } from '../../validators/generate-validation-message';
import { listUserValidation, createUserValidation, userIdValidation, updateUserValidation, userTokenValidation } from '../../validators/user-validator';
import { FamilleIdValidation} from '../../validators/famille-validator';
import { FamilleUsecase } from '../../usecases/famille-usecase';
export const UserHandler = (app: express.Express) => {

    // Lister les utilisateurs
    app.get("/users", async (req: Request, res: Response) => {
        const validation = listUserValidation.validate(req.query);
    
        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }
    
        const listUserRequest = validation.value;
        let limit = 20;
        if (listUserRequest.limit) {
            limit = listUserRequest.limit;
        }
        const page = listUserRequest.page ?? 1;
    
        try {
            const userUsecase = new UserUsecase(AppDataSource);
            const listUsers = await userUsecase.listUsers();
    
            // Encapsuler le tableau dans un objet avec la clé "user"
            res.status(200).send({ user: listUsers });
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    // Créer un utilisateur
    app.post("/users", async (req: Request, res: Response) => {
        const validation = createUserValidation.validate(req.body);

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }

        const userRequest = validation.value;

        try {
            const userUsecase = new UserUsecase(AppDataSource);
            const userCreated = await userUsecase.createUser(userRequest);
            res.status(201).send(userCreated);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });



    // Supprimer un utilisateur
    app.delete("/users/:id", async (req: Request, res: Response) => {
        try {
            const validationResult = userIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }

            const userId = validationResult.value;

            const userUsecase = new UserUsecase(AppDataSource);
            const user = await userUsecase.getUserById(userId.id);

            if (user === null) {
                res.status(404).send({ "error": `User ${userId.id} not found` });
                return;
            }

            await userUsecase.deleteUser(userId.id);
            res.status(200).send("User supprimé avec succès");
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    // Obtenir un utilisateur par son ID
    app.get("/users/:id", async (req: Request, res: Response) => {
        try {
            const validationResult = userIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }

            const userId = validationResult.value;

            const userUsecase = new UserUsecase(AppDataSource);
            const user = await userUsecase.getUserById(userId.id);

            if (user === null) {
                res.status(404).send({ "error": `User ${userId.id} not found` });
                return;
            }

            res.status(200).send(user);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.get("/usersbytoken/:token", async (req: Request, res: Response) => {
        try {
            const validationResult = userTokenValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }

            const userToken = validationResult.value;

            const userUsecase = new UserUsecase(AppDataSource);
            const user = await userUsecase.getUserByToken(userToken.token);

            if (user === null) {
                res.status(404).send({ "error": `User ${userToken.token} not found` });
                return;
            }

            res.status(200).send(user);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    // Mettre à jour un utilisateur
    app.patch("/users/:id", async (req: Request, res: Response) => {
        try {
            const validationResult = updateUserValidation.validate({ ...req.params, ...req.body });

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }

            const updateUserRequest = validationResult.value;

            const userUsecase = new UserUsecase(AppDataSource);
            const updatedUser = await userUsecase.updateUser(updateUserRequest.id, updateUserRequest);

            if (updatedUser === null) {
                res.status(404).send({ "error": `User ${updateUserRequest.id} not found` });
                return;
            }

            res.status(200).send(updatedUser);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    // Ajouter un utilisateur à une famille
    app.post("/users/:id/famille", async (req: Request, res: Response) => {
        try {
            const validationResult = userIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }

            const userId = validationResult.value;

            const userUsecase = new UserUsecase(AppDataSource);
            const user = await userUsecase.addUserToFamille(userId.id, req.body.idFamille);

            if (user === null) {
                res.status(404).send({ "error": `User ${userId.id} not found` });
                return;
            }

            res.status(200).send(user);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });





    app.get("/users/family/:id", async (req: Request, res: Response) => {
        try {
     
            const validationResult = FamilleIdValidation.validate(req.params);
    
            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }
    
            const  idFamille  = validationResult.value.id;
    
            // Utilisation du UserUsecase pour récupérer les utilisateurs
            const familleUsecase = new FamilleUsecase(AppDataSource);
            const users = await familleUsecase.getFamilyMembers(idFamille);
    
       
    

            res.status(200).send(users);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

};