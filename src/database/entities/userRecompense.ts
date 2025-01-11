import { Entity, PrimaryColumn, ManyToOne, Column } from 'typeorm';
import { User } from './user';
import { Recompense } from './recompense';

@Entity()
export class UserRecompense {
    @PrimaryColumn()
    idUser: number;

    @PrimaryColumn()
    idRecompense: number;

    @Column({ type: 'date' })
    date_obtention: Date;

    @ManyToOne(() => User, user => user.userRecompenses)
    user: User;

    @ManyToOne(() => Recompense, recompense => recompense.userRecompenses)
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