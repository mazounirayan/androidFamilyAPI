import { DataSource } from "typeorm";
import { Tache } from "../database/entities/tache";
import { User } from "../database/entities/user";
import { TransactionCoins } from "../database/entities/transactionCoins";

export class TacheUsecase {
    constructor(private readonly db: DataSource) {}

    // Créer une tâche
    async createTache(tacheData: Partial<Tache>): Promise<Tache> {
        try {
            const repo = this.db.getRepository(Tache);
            const tache = repo.create(tacheData);
            return await repo.save(tache);
        } catch (error) {
            console.error('Erreur dans TacheUsecase.createTache:', error);
            throw error;
        }
    }
    

    // Marquer une tâche comme terminée
    async markTacheAsCompleted(idTache: number) {
        const repo = this.db.getRepository(Tache);
        const tache = await repo.findOneBy({ idTache });
        if (!tache) return null; // Return null if task is not found

        tache.status = "Completed";
        await repo.save(tache);

        // Ajouter des points à l'utilisateur
        const userRepo = this.db.getRepository(User);
        const user = await userRepo.findOneBy({ id: tache.user.id });
        if (!user) throw new Error("User not found");

        user.coins += 10; // Exemple : 10 points pour une tâche terminée
        await userRepo.save(user);

        // Enregistrer la transaction
        const transactionRepo = this.db.getRepository(TransactionCoins);
        const transaction = transactionRepo.create({
            user: tache.user,
            type: "Gain",
            montant: 10,
            description: `Tâche terminée : ${tache.nom}`,
        });
        await transactionRepo.save(transaction);

        return tache;
    }

    // Lister les tâches d'un utilisateur
    async listTachesByUser(idUser: number) {
        const repo = this.db.getRepository(Tache);
        return await repo.find({ where: { user: { id: idUser } } });
    }

    // Supprimer une tâche
    async deleteTache(idTache: number) {
        const repo = this.db.getRepository(Tache);
        const tache = await repo.findOneBy({ idTache });
        if (!tache) throw new Error("Tache not found");
        return await repo.remove(tache);
    }

// Mettre à jour une tâche
async updateTache(idTache: number, tacheData: Partial<Tache>) {
    const repo = this.db.getRepository(Tache);

    const tache = await repo.findOne({
        where: { idTache },
        relations: ["user"] // Charge l'utilisateur actuel
    });

    if (!tache) throw new Error("Tâche non trouvée");

    console.log("Tâche actuelle :", tache);
    console.log("Nouvelle valeur :", tacheData);

    const ancienStatus = tache.status; // Statut actuel avant modification
    const nouveauStatus = tacheData.status; // Nouveau statut demandé

    // Vérifier si le statut change réellement
    if (nouveauStatus && nouveauStatus !== ancienStatus) {
        tacheData.ancien_status = ancienStatus; // Sauvegarder l'ancien statut

        const userRepo = this.db.getRepository(User);
        const user = await userRepo.findOneBy({ id: tache.user.id });

        if (user) {
            if (ancienStatus !== "FINI" && nouveauStatus === "FINI") {
                // Passage vers "FINI" => Ajouter 30 coins
                console.log("Ajout de 30 coins");
                user.coins += 30;
                await userRepo.save(user);
            } 
            else if (ancienStatus === "FINI" && (nouveauStatus === "EN_COURS" || nouveauStatus === "A_FAIRE")) {
                // Passage de "FINI" vers "EN_COURS" ou "A_FAIRE" => Retirer 30 coins
                console.log("Suppression de 30 coins");
                user.coins -= 30;
                await userRepo.save(user);
            }
        }
    } else {
        console.log("Le statut n'a pas changé, aucune modification de coins.");
    }

    // Vérifier si l'utilisateur change
    if (tacheData.user?.id) {
        const userRepo = this.db.getRepository(User);
        const newUser = await userRepo.findOneBy({ id: tacheData.user?.id });

        if (!newUser) throw new Error("Utilisateur non trouvé");

        tache.user = newUser;
    }

    Object.assign(tache, tacheData);
    console.log("Nouvelle tâche mise à jour :", tache);
    
    return await repo.save(tache);
}




    async listTachesByUserId(idUser: number): Promise<Tache[]> {
        const repo = this.db.getRepository(Tache);
        const taches = await repo.find({ where: { user: { id: idUser } },relations : ['user']});
    
   
        return taches;
    }
    async assignTacheToUser(tacheId: number, userId: number): Promise<void> {
        const repo = this.db.getRepository(Tache);
        const Userrepo = this.db.getRepository(User);
        const tache = await repo.findOneBy({ idTache: tacheId });

       
        if (!tache) {
            throw new Error("Task not found");
        }
        const user = await Userrepo.findOneBy({ id:userId  });
        if (!user) {
            throw new Error("user not found");
        }
        tache.user = user;
        await repo.save(tache);
    }
    async listTachesByFamilleId(familleId: number): Promise<any[]> {
        const repo = this.db.getRepository(Tache);
    
        const taches = await repo.createQueryBuilder("tache")
            .leftJoin("tache.user", "user")
            .leftJoin("tache.famille", "famille")
            .where("famille.idFamille = :familleId", { familleId })
            .select([
                "tache.idTache AS idTache",
                "tache.nom AS nom",
                "tache.date_debut AS date_debut",
                "tache.date_fin AS date_fin",
                "tache.status AS status",
                "tache.type AS type",
                "tache.description AS description",
                "tache.priorite AS priorite",
                "user.id AS userId",
                "user.nom AS userNom",
                "user.prenom AS userPrenom",
                "user.email AS userEmail",
                "user.motDePasse AS userMotDePasse",
                "user.role AS userRole",
                "user.dateInscription AS userDateInscription",
                "user.avatar AS userAvatar",
                "user.coins AS userCoins",
                "user.totalPoints AS userTotalPoints",
                "user.numTel AS userNumTel",
                "famille.idFamille AS idFamille"
            ])
            .getRawMany();
    
        // Reformate les résultats pour structurer les données
        return taches.map(tache => ({
            idTache: tache.idTache,
            nom: tache.nom,
            date_debut: tache.date_debut,
            date_fin: tache.date_fin,
            status: tache.status,
            type: tache.type,
            description: tache.description,
            priorite: tache.priorite,
            idFamille: tache.idFamille, // Ajout de l'ID de la famille directement dans la tâche
            user: {
                id: tache.userId,
                nom: tache.userNom,
                prenom: tache.userPrenom,
                email: tache.userEmail,
                motDePasse: tache.userMotDePasse,
                role: tache.userRole,
                dateInscription: tache.userDateInscription,
                avatar: tache.userAvatar,
                coins: tache.userCoins,
                totalPoints: tache.userTotalPoints,
                numTel: tache.userNumTel
            }
        }));
    }
    
    // Lister les tâches avec pagination et filtres
  
    async listTaches() {
        const repo = this.db.getRepository(Tache);
        const users = await repo.find({
            relations: ['famille','user']
        });
        return users;
    }

    // Obtenir une tâche par son ID
    async getTacheById(idTache: number) {
        const repo = this.db.getRepository(Tache);
        return await repo.findOneBy({ idTache });
    }
}
