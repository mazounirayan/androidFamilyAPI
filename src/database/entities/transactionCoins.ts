import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./user";

@Entity()
export class TransactionCoins {
    @PrimaryGeneratedColumn()
    idTransaction: number;

    @ManyToOne(() => User, user => user.transactions)
    user: User; // Relation Many-to-One avec User

    @Column({ type: 'enum', enum: ['Gain', 'Depense'] })
    type: 'Gain' | 'Depense'; // Type de transaction

    @Column({ type: 'int' })
    montant: number; // Montant de la transaction

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    date_transaction: Date; // Date de la transaction

    @Column({ type: 'text', nullable: true })
    description: string; // Description de la transaction

    constructor(
        idTransaction: number,
        user: User,
        type: 'Gain' | 'Depense',
        montant: number,
        date_transaction: Date = new Date(),
        description?: string
    ) {
        this.idTransaction = idTransaction;
        this.user = user;
        this.type = type;
        this.montant = montant;
        this.date_transaction = date_transaction;
        this.description = description || "";
    }
}