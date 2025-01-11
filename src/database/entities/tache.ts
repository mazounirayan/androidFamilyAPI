import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Famille } from './famille';
import { User } from './user';
import { CategorieTache } from './CategorieTache';
import { Notification } from './notification';

@Entity()
export class Tache {
    @PrimaryGeneratedColumn()
    idTache: number;

    @Column({ length: 255 })
    nom: string;

    @Column({ type: 'date', nullable: true })
    date_debut: Date;

    @Column({ type: 'date', nullable: true })
    date_fin: Date;

    @Column({ length: 50, nullable: true })
    status: string;

    @Column({ length: 100, nullable: true })
    type: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'enum', enum: ['Haute', 'Moyenne', 'Basse'], nullable: true })
    priorite: 'Haute' | 'Moyenne' | 'Basse';

    @ManyToOne(() => CategorieTache, categorie => categorie.taches)
    categorie: CategorieTache;

    @ManyToOne(() => User, user => user.taches)
    user: User;

    @ManyToOne(() => Famille, famille => famille.taches)
    famille: Famille;

    @OneToMany(() => Notification, notification => notification.tache)
    notifications: Notification[];

    constructor(
        idTache: number,
        nom: string,
        date_debut: Date,
        date_fin: Date,
        status: string,
        type: string,
        description: string,
        priorite: 'Haute' | 'Moyenne' | 'Basse',
        categorie: CategorieTache,
        user: User,
        famille: Famille,
        notifications: Notification[] = []
    ) {
        this.idTache = idTache;
        this.nom = nom;
        this.date_debut = date_debut;
        this.date_fin = date_fin;
        this.status = status;
        this.type = type;
        this.description = description;
        this.priorite = priorite;
        this.categorie = categorie;
        this.user = user;
        this.famille = famille;
        this.notifications = notifications;
    }
}