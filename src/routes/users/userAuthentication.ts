import express, { Request, Response } from "express"
import { AppDataSource } from "../../database/database"
import { compare, hash } from "bcrypt";
import { createUserValidation, LoginUserValidation, userIdValidation } from "../../validators/user-validator"
import { generateValidationErrorMessage } from "../../validators/generate-validation-message";
import { User } from "../../database/entities/user";
import jwt from 'jsonwebtoken'; // Importez jwt pour générer le token
import { UserUsecase } from "../../usecases/user-usecase";
import { Famille } from "../../database/entities/famille";
import { Token } from "../../database/entities/token";

function generateUniqueCode(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
}


export const UserHandlerAuthentication = (app: express.Express) => {
    app.post('/auth/signup', async (req: Request, res: Response) => {
        try {
            // Valider le corps de la requête
            const validationResult = createUserValidation.validate(req.body);
            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }
    
            const createUserRequest = validationResult.value;
    
            const userRepository = AppDataSource.getRepository(User);
            const familleRepository = AppDataSource.getRepository(Famille);
    
            let famille: Famille | null = null;
    
            // Hasher le mot de passe
            const hashedPassword = createUserRequest.motDePasse
                ? await hash(createUserRequest.motDePasse, 10)
                : undefined;
    
            // Logique selon le rôle de l'utilisateur
            if (createUserRequest.role === 'Parent') {
                // Si le parent crée une nouvelle famille
                if (!createUserRequest.nomFamille) {
                    res.status(400).send({ error: "Le nom de la famille est obligatoire pour un parent." });
                    return;
                }
    
                // Vérifier si une famille avec le même nom existe
                famille = await familleRepository.findOne({ where: { nom: createUserRequest.nomFamille } });
    
                if (!famille) {
                    // Créer une nouvelle famille si elle n'existe pas
                    famille = familleRepository.create({
                        nom: createUserRequest.nomFamille,
                        date_de_creation: new Date(),
                        code_invitation: generateUniqueCode(), // Implémentez cette fonction
                    });
                    famille = await familleRepository.save(famille);
                }
            } else if (createUserRequest.role === 'Enfant') {
                // Si l'enfant rejoint une famille existante
                if (!createUserRequest.codeFamille) {
                    res.status(400).send({ error: "Le code famille est obligatoire pour un enfant." });
                    return;
                }
    
                // Vérifier si le code famille est valide
                famille = await familleRepository.findOne({ where: { code_invitation: createUserRequest.codeFamille } });
    
                if (!famille) {
                    res.status(404).send({ error: "Le code famille est invalide." });
                    return;
                }
            } else {
                res.status(400).send({ error: "Rôle utilisateur invalide." });
                return;
            }
    
            // Créer l'utilisateur
            const user = userRepository.create({
                nom: createUserRequest.nom,
                prenom: createUserRequest.prenom,
                email: createUserRequest.email,
                motDePasse: hashedPassword,
                role: createUserRequest.role,
                dateInscription: new Date(),
                famille,
            });
    
            const savedUser = await userRepository.save(user);
    
            // Réponse avec l'utilisateur créé
            res.status(201).send({
                id: savedUser.id,
                nom: savedUser.nom,
                prenom: savedUser.prenom,
                email: savedUser.email,
                role: savedUser.role,
                famille: famille ? { idFamille: famille.idFamille, nom: famille.nom, code_invitation: famille.code_invitation } : null,
            });
        } catch (error: unknown) {
            const mysqlError = error as any;
            if (mysqlError.code === 'ER_DUP_ENTRY') {
                res.status(400).send({ error: "L'adresse email est déjà utilisée." });
            } else {
                console.error('Erreur interne du serveur:', error);
                res.status(500).send({ error: "Erreur interne du serveur. Réessayez plus tard." });
            }
        }
    });
    
    
    

    app.post('/auth/login', async (req: Request, res: Response) => {
        try {

            const validationResult = LoginUserValidation.validate(req.body)

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details))
                return
            }
            const loginUserRequest = validationResult.value

            let user = await AppDataSource.getRepository(User).findOneBy({ email: loginUserRequest.email });

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
            const token = jwt.sign(
                { userId: user.id, email: user.email }, // Payload (données à inclure dans le token)
                process.env.JWT_SECRET || 'your_secret_key', // Clé secrète pour signer le token
                {     expiresIn: '1d'} // Durée de validité du token
            );

            await AppDataSource.getRepository(Token).save({ token: token, user: user})

    
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
            
            res.status(200).json({
                token, 
                user, 
            });
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

            userUsecase.deleteToken(user.id)

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


