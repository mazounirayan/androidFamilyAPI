import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user';

@Entity('recompense')
export class Recompense {
  @PrimaryGeneratedColumn()
  idRecompense: number;

  @Column()
  coin: number;

  @ManyToOne(() => User, (user) => user.recompenses)
  user: User;

  constructor( idRecompense: number, coin: number, user: User) {
    this.coin = coin;
    this.idRecompense=idRecompense;
    this.user = user;
  }
}
