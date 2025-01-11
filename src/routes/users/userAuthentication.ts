import express, { Request, Response } from "express"
import { AppDataSource } from "../../database/database"
import { compare, hash } from "bcrypt";
import { createUserValidation, LoginUserValidation, userIdValidation } from "../../validators/user-validator"
import { generateValidationErrorMessage } from "../../validators/generate-validation-message";
import { User } from "../../database/entities/user";

import { UserUsecase } from "../../usecases/user-usecase";



export const UserHandlerAuthentication = (app: express.Express) => {
    app.post('/auth/signup', async (req: Request, res: Response) => {
        try {
            const validationResult = createUserValidation.validate(req.body)
            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details))
                return
            }

            const createUserRequest = validationResult.value;

            let hashedPassword;
            if(createUserRequest.motDePasse !== undefined){
                hashedPassword = await hash(createUserRequest.motDePasse, 10);
            }

            const userRepository = AppDataSource.getRepository(User);
            const user = await userRepository.save({
                nom: req.body.nom,
                prenom: req.body.prenom,
                email: req.body.email,
                motDePasse: req.body.motDePasse, 
                numTel: req.body.numTel,
                role: req.body.role,
                dateInscription: new Date(),
                
            });

            res.status(201).send({ id: user.id,nom: user.nom,prenom:user.prenom ,email: user.email, role: user.role });
            return
        } catch (error: unknown) {
            // Vérification de l'erreur de la base de données
            const mysqlError = error as any;
            if (error instanceof Error) {
                
            if (mysqlError.code === 'ER_DUP_ENTRY') {
                res.status(400).send({ error: "L'adresse email est déjà utilisée." });
                } else {
                    // Log de l'erreur pour le débogage
                    console.error('Erreur interne du serveur:', error);
    
                    // Envoi de la réponse d'erreur générique
                    res.status(500).send({ error: "Erreur interne du serveur. Réessayez plus tard." });
                }
            } else {
                // En cas d'erreur inconnue non instance de Error
                console.error('Erreur inconnue:', error);
                res.status(500).send({ error: "Erreur inconnue. Réessayez plus tard." });
            }
            return
        }
    })

    app.post('/auth/login', async (req: Request, res: Response) => {
        try {
            console.error("Body reçu :", req.body);


            const validationResult = LoginUserValidation.validate(req.body)
            console.error("Validation result :", validationResult);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details))
                return
            }
            const loginUserRequest = validationResult.value

            // valid user exist
            let user = await AppDataSource.getRepository(User).findOneBy({ email: loginUserRequest.email });
            console.error("Utilisateur trouvé :", user);
            console.error("Utilisateur trouvé (ou null) :", user);
        
            console.error("Mot de passe reçu :", loginUserRequest.motDePasse);
            console.error("Mot de passe stocké :", user?.motDePasse);
            if (!user) {
                res.status(400).send({ error: "username or password not valid" })
                return
            } 




            
 


          //  a remetrre apres les test   const isValid = await compare(loginUserRequest.motDePasse, user.motDePasse);
            const isValid = loginUserRequest.motDePasse === user.motDePasse;

            if (!isValid) {
                res.status(400).send({ error: "username or password not valid" })
                return
            }

            const userUsecase = new UserUsecase(AppDataSource);

            user = await userUsecase.getOneUser(user.id);
            console.error("User récupéré par UserUsecase :", user);
            
            
            if (user === null) {
                res.status(404).send({ "error": `user not found` })
                return
            }
            
       

            await userUsecase.updateUser(
                user.id,
                { ...user }
            );
            
            res.status(200).json({  user });
        } catch (error) {
            console.log(error)
            res.status(500).send({ "error": "internal error retry later" })
            return
        }
    })

    app.delete('/auth/logout/:id', async (req: Request, res: Response) => {
        try {
            const validationResult = userIdValidation.validate({ ...req.params, ...req.body });


            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }

            const userUsecase = new UserUsecase(AppDataSource);
            
            if(await userUsecase.verifUser(+req.params.id) === false){
                res.status(400).send({ "error": `Bad user` });
                return;
            } 

            const userId = validationResult.value

            const userRepository = AppDataSource.getRepository(User);
            const user = await userRepository.findOneBy({ id: userId.id })

            if (user === null) {
                res.status(404).send({ "error": `user ${userId.id} not found` })
                return
            }


            await userUsecase.updateUser(
                user.id,
                { ...user }
            );
            
            
            res.status(201).send({ "message": "logout success" });
            return
        } catch (error) {
            console.log(error)
            res.status(500).send({ "error": "internal error retry later" })
            return
        }
    })

}


