"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const typeorm_1 = require("typeorm");
const user_1 = require("./user");
const chat_1 = require("./chat");
let Message = class Message {
    constructor(idMessage, contenu, date_envoie, isVue, user, chat) {
        this.idMessage = idMessage;
        this.contenu = contenu;
        this.date_envoie = date_envoie;
        this.isVue = isVue;
        this.user = user;
        this.chat = chat;
    }
};
exports.Message = Message;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Message.prototype, "idMessage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Message.prototype, "contenu", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime' }),
    __metadata("design:type", Date)
], Message.prototype, "date_envoie", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean' }),
    __metadata("design:type", Boolean)
], Message.prototype, "isVue", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_1.User, user => user.messages),
    __metadata("design:type", user_1.User)
], Message.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => chat_1.Chat, chat => chat.messages),
    __metadata("design:type", chat_1.Chat)
], Message.prototype, "chat", void 0);
exports.Message = Message = __decorate([
    (0, typeorm_1.Entity)('Message'),
    __metadata("design:paramtypes", [Number, String, Date, Boolean, user_1.User,
        chat_1.Chat])
], Message);
