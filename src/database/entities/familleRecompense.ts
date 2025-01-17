import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn } from 'typeorm';
import { Recompense } from './recompense';
import { Famille } from './famille';

@Entity("FamilleRecompense")
export class FamilleRecompense {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Famille, (famille) => famille.familleRecompenses, { onDelete: 'CASCADE' })
    famille: Famille;

    @ManyToOne(() => Recompense, (recompense) => recompense.familleRecompenses, { onDelete: 'CASCADE' })
    recompense: Recompense;
    constructor(
        id: number,
        famille: Famille,
        recompense: Recompense,
       
       
    ) {
        this.id = id;
        this.famille = famille;
        this.recompense = recompense;
    
    }

}