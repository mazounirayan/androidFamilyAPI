import { Entity, PrimaryColumn, ManyToOne, Column, JoinColumn } from 'typeorm';
import { User } from './user';
import { Badge } from './Badge';

@Entity('UserBadge')
export class UserBadge {
    @PrimaryColumn()
    idUser: number;

    @PrimaryColumn()
    idBadge: number;

    @Column({ type: 'date' })
    date_obtention: Date;
    @ManyToOne(() => User, user => user.userBadges)
    @JoinColumn({ name: "idUser" })
    user: User;

    @ManyToOne(() => Badge, badge => badge.userBadges)
    @JoinColumn({ name: "idBadge" })
    badge: Badge;

    constructor(
        idUser: number,
        idBadge: number,
        date_obtention: Date,
        user: User,
        badge: Badge
    ) {
        this.idUser = idUser;
        this.idBadge = idBadge;
        this.date_obtention = date_obtention;
        this.user = user;
        this.badge = badge;
    }
}