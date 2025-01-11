import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserBadge } from './userBadge'; 

@Entity()
export class Badge {
    @PrimaryGeneratedColumn()
    idBadge: number;

    @Column({ length: 255 })
    nom: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ length: 255, nullable: true })
    image: string; // Chemin de l'image du badge

    @OneToMany(() => UserBadge, userBadge => userBadge.badge)
    userBadges: UserBadge[]; // Relation avec la table user_badge

    constructor(
        idBadge: number,
        nom: string,
       
        userBadges: UserBadge[] , description?: string,
        image?: string,
    ) {
        this.idBadge = idBadge;
        this.nom = nom;
        this.description = description || "null";
        this.image = image || "null";
        this.userBadges = userBadges;
    }
}