import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn, PrimaryColumn, JoinColumn } from 'typeorm';
import { Recompense } from './recompense';
import { Famille } from './famille';

@Entity("FamilleRecompense")
export class FamilleRecompense {
    @PrimaryColumn()
    idFamille: number;

    @PrimaryColumn()
    idRecompense: number;

  

    @ManyToOne(() => Famille, famille => famille.familleRecompenses)
    @JoinColumn({ name: 'idFamille' })
    famille: Famille;

    @ManyToOne(() => Recompense, recompense => recompense.familleRecompenses)
    @JoinColumn({ name: 'idRecompense' })
    recompense: Recompense;
    constructor(
        idFamille: number,idRecompense: number,
        famille: Famille,
        recompense: Recompense,
       
       
    ) {
        this.idRecompense = idRecompense;

        this.idFamille = idFamille;
        this.famille = famille;
        this.recompense = recompense;
    
    }

}