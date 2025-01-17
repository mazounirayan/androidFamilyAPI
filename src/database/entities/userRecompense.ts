import { Entity, PrimaryColumn, ManyToOne, Column, JoinColumn } from 'typeorm';
import { User } from './user';
import { Recompense } from './recompense';

@Entity('UserRecompense')
export class UserRecompense {
    @PrimaryColumn()
    idUser: number;

    @PrimaryColumn()
    idRecompense: number;

    @Column({ type: 'date' })
    date_obtention: Date;

    @ManyToOne(() => User, user => user.userRecompenses)
    @JoinColumn({ name: 'idUser' }) // Spécifiez explicitement le nom de la colonne
    user: User;

    @ManyToOne(() => Recompense, recompense => recompense.userRecompenses)
    @JoinColumn({ name: 'idRecompense' }) // Spécifiez explicitement le nom de la colonne
    recompense: Recompense;

    constructor(
        idUser: number,
        idRecompense: number,
        date_obtention: Date,
        user: User,
        recompense: Recompense
    ) {
        this.idUser = idUser;
        this.idRecompense = idRecompense;
        this.date_obtention = date_obtention;
        this.user = user;
        this.recompense = recompense;
    }
}