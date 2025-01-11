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
exports.TransactionCoins = void 0;
const typeorm_1 = require("typeorm");
const user_1 = require("./user");
let TransactionCoins = class TransactionCoins {
    constructor(idTransaction, user, type, montant, date_transaction = new Date(), description) {
        this.idTransaction = idTransaction;
        this.user = user;
        this.type = type;
        this.montant = montant;
        this.date_transaction = date_transaction;
        this.description = description || "";
    }
};
exports.TransactionCoins = TransactionCoins;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TransactionCoins.prototype, "idTransaction", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_1.User, user => user.transactions),
    __metadata("design:type", user_1.User)
], TransactionCoins.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['Gain', 'Depense'] }),
    __metadata("design:type", String)
], TransactionCoins.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], TransactionCoins.prototype, "montant", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], TransactionCoins.prototype, "date_transaction", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], TransactionCoins.prototype, "description", void 0);
exports.TransactionCoins = TransactionCoins = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Number, user_1.User, String, Number, Date, String])
], TransactionCoins);
