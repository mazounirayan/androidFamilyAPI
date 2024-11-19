import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from './user';
import { Tache } from './tache';

@Entity('famille')
export class Famille {
  @PrimaryGeneratedColumn()
  idFamille: number;

  @Column({ length: 255 })
  nom: string;

  @Column({ type: "date", default: () => "CURRENT_TIMESTAMP" })
  date_de_creation: Date;

  @OneToMany(() => User, (user) => user.famille)
  utilisateurs: User[];

  @OneToMany(() => Tache, (tache) => tache.famille)
  taches: Tache[];
  constructor(
    nom: string,
    taches: Tache[],
    utilisateurs: User[],
    idFamille: number,
    date_de_creation:Date
  ) {
    this.nom = nom;
    this.utilisateurs = utilisateurs;
    this.idFamille =idFamille;
    this.date_de_creation = date_de_creation;
    this.taches= taches;
  }

}
