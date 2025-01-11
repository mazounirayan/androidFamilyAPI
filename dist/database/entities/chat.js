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
exports.Chat = void 0;
const typeorm_1 = require("typeorm");
const message_1 = require("./message");
let Chat = class Chat {
    constructor(idChat, libelle, messages) {
        this.libelle = libelle;
        this.idChat = idChat;
        this.messages = messages; // Initialiser messages comme un tableau vide
    }
};
exports.Chat = Chat;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Chat.prototype, "idChat", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Chat.prototype, "libelle", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => message_1.Message, (message) => message.chat),
    __metadata("design:type", Array)
], Chat.prototype, "messages", void 0);
exports.Chat = Chat = __decorate([
    (0, typeorm_1.Entity)('Chat'),
    __metadata("design:paramtypes", [Number, String, Array])
], Chat);
