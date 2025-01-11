"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationUsecase = void 0;
const notification_1 = require("../database/entities/notification");
class NotificationUsecase {
    constructor(db) {
        this.db = db;
    }
    createNotification(notificationData) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.db.getRepository(notification_1.Notification);
            const notification = repo.create(notificationData);
            return yield repo.save(notification);
        });
    }
    // Marquer une notification comme vue
    markAsViewed(idNotification) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.db.getRepository(notification_1.Notification);
            const notification = yield repo.findOneBy({ idNotification }); // Correction ici
            if (!notification)
                throw new Error("Notification not found");
            notification.isVue = true;
            return yield repo.save(notification);
        });
    }
    // Lister les notifications avec pagination
    listNotifications(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.db.getRepository(notification_1.Notification);
            const query = repo.createQueryBuilder("notification");
            if (options.idUser) {
                query.where("notification.idUser = :idUser", { idUser: options.idUser });
            }
            const [notifications, total] = yield query
                .skip((options.page - 1) * options.limit)
                .take(options.limit)
                .getManyAndCount();
            return { notifications, total, page: options.page, limit: options.limit };
        });
    }
    // Récupérer une notification par son ID
    getNotificationById(idNotification) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.db.getRepository(notification_1.Notification);
            return yield repo.findOneBy({ idNotification });
        });
    }
    // Supprimer une notification
    deleteNotification(idNotification) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.db.getRepository(notification_1.Notification);
            const notification = yield repo.findOneBy({ idNotification });
            if (!notification)
                throw new Error("Notification not found");
            yield repo.remove(notification);
        });
    }
    // Mettre à jour une notification
    updateNotification(idNotification, notificationData) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.db.getRepository(notification_1.Notification);
            const notification = yield repo.findOneBy({ idNotification });
            if (!notification)
                throw new Error("Notification not found");
            Object.assign(notification, notificationData);
            return yield repo.save(notification);
        });
    }
}
exports.NotificationUsecase = NotificationUsecase;
