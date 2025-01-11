import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user';
import { Tache } from './tache';

@Entity('Notification')
export class Notification {
  @PrimaryGeneratedColumn()
  idNotification: number;

  @Column('text')
  message: string;

  @Column({ type: 'datetime' })
  date_envoie: Date;

  @Column({ default: false })
  isVue: boolean;

  // Relation avec User
  @ManyToOne(() => User, (user) => user.notifications)
  @JoinColumn({ name: 'idUser' })
  user: User;

  // Relation avec Tache
  @ManyToOne(() => Tache, (tache) => tache.notifications)
  @JoinColumn({ name: 'idTache' })
  tache: Tache;

  constructor(  idNotification:number, message: string, date_envoie: Date, isVue: boolean, user: User, tache: Tache) {
    this.message = message;
    this.idNotification = idNotification;
    this.date_envoie = date_envoie;
    this.isVue = isVue;
    this.user = user;
    this.tache = tache;
  }
}
