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
    markAsViewed(idNotification) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.db.getRepository(notification_1.Notification);
            const notification = yield repo.findOneBy({ idNotification });
            if (!notification)
                throw new Error("Notification not found");
            notification.isVue = true;
            return yield repo.save(notification);
        });
    }
    listNotifications() {
        return __awaiter(this, arguments, void 0, function* (page = 1, limit = 10, idUser) {
            const repo = this.db.getRepository(notification_1.Notification);
            const query = repo.createQueryBuilder("notification");
            if (idUser) {
                query.where("notification.idUser LIKE :idUser", { idUser: `%${idUser}%` });
            }
            query.skip((page - 1) * limit).take(limit);
            return query.getMany();
        });
    }
}
exports.NotificationUsecase = NotificationUsecase;
