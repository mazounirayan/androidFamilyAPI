import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from './user';

@Entity('famille')
export class Famille {
  @PrimaryGeneratedColumn()
  idFamille: number;

  @Column({ length: 255 })
  nom: string;

  @OneToMany(() => User, (user) => user.famille)
  utilisateurs: User[];
  constructor(
    nom: string,
    utilisateurs: User[],
    idFamille: number
  ) {
    this.nom = nom;
    this.utilisateurs = utilisateurs;
    this.idFamille =idFamille;

  }

}
