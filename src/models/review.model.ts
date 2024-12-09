import { Table, Model, Column, DataType, Default, BelongsTo, ForeignKey } from "sequelize-typescript";
import Customer from "./customer.model";

@Table({
    tableName: 'reviews'
})

class Review extends Model {

    @Column({
        type: DataType.TEXT,
        allowNull: false
    })
    description: string

    @Default(false)
    @Column({
        type: DataType.BOOLEAN,
        allowNull: true
    })
    visibility: boolean

    @Default(0.0)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    qualification: number

    // Relación: un Review pertenece a un Customer
    @ForeignKey(() => Customer)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        unique: true
    })
    customerId: number

    @BelongsTo(() => Customer)
    customer: Customer
}

export default Review