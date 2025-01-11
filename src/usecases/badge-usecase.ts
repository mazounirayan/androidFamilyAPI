import { DataSource } from "typeorm";
import { Badge } from "../database/entities/Badge";
import { User } from "../database/entities/user";
import { UserBadge } from "../database/entities/userBadge";

export class BadgeUsecase {
    constructor(private readonly db: DataSource) {}

    async createBadge(badgeData: Partial<Badge>) {
        const repo = this.db.getRepository(Badge);
        const badge = repo.create(badgeData);
        return await repo.save(badge);
    }

    // Lister les badges avec pagination
    async listBadges(options: { page: number; limit: number }) {
        const repo = this.db.getRepository(Badge);
        const [badges, total] = await repo.findAndCount({
            skip: (options.page - 1) * options.limit,
            take: options.limit,
        });
        return { badges, total, page: options.page, limit: options.limit };
    }

    // Récupérer un badge par son ID
    async getBadgeById(idBadge: number) {
        const repo = this.db.getRepository(Badge);
        return await repo.findOneBy({ idBadge }); // Correction ici
    }

    // Supprimer un badge
    async deleteBadge(idBadge: number) {
        const repo = this.db.getRepository(Badge);
        const badge = await repo.findOneBy({ idBadge });
        if (!badge) throw new Error("Badge not found");
        await repo.remove(badge);
    }

    // Mettre à jour un badge
    async updateBadge(idBadge: number, badgeData: Partial<Badge>) {
        const repo = this.db.getRepository(Badge);
        const badge = await repo.findOneBy({ idBadge });
        if (!badge) throw new Error("Badge not found");
        Object.assign(badge, badgeData);
        return await repo.save(badge);
    }

    // Attribuer un badge à un utilisateur
    async assignBadgeToUser(idUser: number, idBadge: number) {
        const userRepo = this.db.getRepository(User);
        const badgeRepo = this.db.getRepository(Badge);
        const userBadgeRepo = this.db.getRepository(UserBadge);
       

        const user = await userRepo.findOneBy({ id: idUser });
        const badge = await badgeRepo.findOneBy({ idBadge });


        if (!user || !badge) throw new Error("User or Badge not found");

        // Vérifier si l'utilisateur a déjà ce badge
        const existingBadge = await userBadgeRepo.findOne({ where: { idUser, idBadge } });
        if (existingBadge) throw new Error("User already has this badge");

        const userBadge = userBadgeRepo.create({ idUser, idBadge, date_obtention: new Date() });
        return await userBadgeRepo.save(userBadge);
    }

    // Lister les badges d'un utilisateur
    async listUserBadges(idUser: number) {
        const repo = this.db.getRepository(UserBadge);
        return await repo.find({ where: { idUser }, relations: ["badge"] });
    }
    async getBadgesByUserId(userId: number): Promise<Badge[]> {
        const repo = this.db.getRepository(Badge);
        const badges = await repo
            .createQueryBuilder("badge")
            .innerJoin("badge.userBadges", "userBadge")
            .where("userBadge.idUser = :userId", { userId })
            .getMany();
    
        if (!badges || badges.length === 0) {
            throw new Error("No badges found for this user");
        }
    
        return badges;
    }
    async unassignBadgeFromUser(userId: number, badgeId: number): Promise<void> {
        const repo = this.db.getRepository(UserBadge);
        const result = await repo
            .createQueryBuilder()
            .delete()
            .where("idUser = :userId AND idBadge = :badgeId", { userId, badgeId })
            .execute();
    
        if (result.affected === 0) {
            throw new Error("Badge assignment not found or already removed");
        }
    }
}