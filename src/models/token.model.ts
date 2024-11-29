import { BelongsTo, Column, DataType, Default, ForeignKey, Model, Table } from "sequelize-typescript";
import Customer from "./customer.model";

@Table({
    tableName: 'tokens',
    timestamps: false,
})

class Token extends Model {

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    token: string

    @Default(Date.now())
    @Column({
        type: DataType.DATE,
    })
    declare createdAt: Date

    @Default(() => new Date(Date.now() + 24 * 60 * 60 * 1000)) // Expira en 1 día
    @Column({
        type: DataType.DATE,
    })
    expiresAt: Date;

    @ForeignKey(() => Customer)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    customerId: number

    @BelongsTo(() => Customer)
    customer: Customer
}

export default Token