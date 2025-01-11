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
exports.Recompense = void 0;
const typeorm_1 = require("typeorm");
const userRecompense_1 = require("./userRecompense"); // Assurez-vous de créer cette entité
let Recompense = class Recompense {
    constructor(idRecompense, nom, cout, stock = 0, estDisponible = true, userRecompenses, description) {
        this.idRecompense = idRecompense;
        this.nom = nom;
        this.cout = cout;
        this.description = description || "";
        this.stock = stock;
        this.estDisponible = estDisponible;
        this.userRecompenses = userRecompenses;
    }
};
exports.Recompense = Recompense;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Recompense.prototype, "idRecompense", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], Recompense.prototype, "nom", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Recompense.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Recompense.prototype, "cout", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Recompense.prototype, "stock", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Recompense.prototype, "estDisponible", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => userRecompense_1.UserRecompense, userRecompense => userRecompense.recompense),
    __metadata("design:type", Array)
], Recompense.prototype, "userRecompenses", void 0);
exports.Recompense = Recompense = __decorate([
    (0, typeorm_1.Entity)('Recompense'),
    __metadata("design:paramtypes", [Number, String, Number, Number, Boolean, Array, String])
], Recompense);
