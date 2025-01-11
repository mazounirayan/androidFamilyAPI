import { DataSource } from "typeorm";
import { Notification } from "../database/entities/notification";

export class NotificationUsecase {
    constructor(private readonly db: DataSource) {}

    async createNotification(notificationData: Partial<Notification>) {
        const repo = this.db.getRepository(Notification);
        const notification = repo.create(notificationData);
        return await repo.save(notification);
    }

    // Marquer une notification comme vue
    async markAsViewed(idNotification: number) {
        const repo = this.db.getRepository(Notification);
        const notification = await repo.findOneBy({  idNotification }); // Correction ici
        if (!notification) throw new Error("Notification not found");
        notification.isVue = true;
        return await repo.save(notification);
    }

    // Lister les notifications avec pagination
    async listNotifications(options: { page: number; limit: number; idUser?: number }) {
        const repo = this.db.getRepository(Notification);
        const query = repo.createQueryBuilder("notification");

        if (options.idUser) {
            query.where("notification.idUser = :idUser", { idUser: options.idUser });
        }

        const [notifications, total] = await query
            .skip((options.page - 1) * options.limit)
            .take(options.limit)
            .getManyAndCount();

        return { notifications, total, page: options.page, limit: options.limit };
    }

    // Récupérer une notification par son ID
    async getNotificationById(idNotification: number) {
        const repo = this.db.getRepository(Notification);
        return await repo.findOneBy({ idNotification });
    }

    // Supprimer une notification
    async deleteNotification(idNotification: number) {
        const repo = this.db.getRepository(Notification);
        const notification = await repo.findOneBy({ idNotification });
        if (!notification) throw new Error("Notification not found");
        await repo.remove(notification);
    }

    // Mettre à jour une notification
    async updateNotification(idNotification: number, notificationData: Partial<Notification>) {
        const repo = this.db.getRepository(Notification);
        const notification = await repo.findOneBy({ idNotification });
        if (!notification) throw new Error("Notification not found");
        Object.assign(notification, notificationData);
        return await repo.save(notification);
    }

}
