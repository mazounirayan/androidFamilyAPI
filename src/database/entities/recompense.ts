import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserRecompense } from './userRecompense'; // Assurez-vous de créer cette entité
import { FamilleRecompense } from './familleRecompense';

@Entity('Recompense')
export class Recompense {
    @PrimaryGeneratedColumn()
    idRecompense: number;

    @Column({ length: 255 })
    nom: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'int' })
    cout: number; // Coût en points pour obtenir la récompense

    @Column({ type: 'int', default: 0 })
    stock: number; // Quantité disponible

    @Column({ type: 'boolean', default: true })
    estDisponible: boolean; // Si la récompense est encore disponible

    @OneToMany(() => UserRecompense, userRecompense => userRecompense.recompense)
    userRecompenses: UserRecompense[]; // Relation avec la table user_recompense
    @OneToMany(() => UserRecompense, userRecompense => userRecompense.recompense)
    familleRecompenses: FamilleRecompense[]; // Relation avec la table user_recompense

    constructor(
        idRecompense: number,
        nom: string,
        cout: number,
        familleRecompenses:FamilleRecompense[],
        stock: number = 0,
        estDisponible: boolean = true,
        userRecompenses: UserRecompense[], description?: string,
    ) {
        this.idRecompense = idRecompense;
        this.nom = nom;
        this.cout = cout;
        this.description = description || "";
        this.stock = stock;
        this.estDisponible = estDisponible;
        this.userRecompenses = userRecompenses;
        this.familleRecompenses = familleRecompenses;
    }
}