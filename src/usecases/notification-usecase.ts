import { DataSource } from "typeorm";
import { Notification } from "../database/entities/notification";

export class NotificationUsecase {
    constructor(private readonly db: DataSource) {}

    async createNotification(notificationData: Partial<Notification>) {
        const repo = this.db.getRepository(Notification);
        const notification = repo.create(notificationData);
        return await repo.save(notification);
    }

    async markAsViewed(idNotification: number) {
        const repo = this.db.getRepository(Notification);
        const notification = await repo.findOneBy({ idNotification });
        if (!notification) throw new Error("Notification not found");
        notification.isVue = true;
        return await repo.save(notification);
    }

    async listNotifications(page: number = 1, limit: number = 10,idUser?: number): Promise<Notification[]> {
        const repo = this.db.getRepository(Notification);
        const query = repo.createQueryBuilder("notification");
        if (idUser) {
            query.where("notification.idUser LIKE :idUser", { idUser: `%${idUser}%` });
        }

        query.skip((page - 1) * limit).take(limit);
        return query.getMany();
    }

}
