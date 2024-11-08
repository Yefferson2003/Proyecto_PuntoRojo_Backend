import { Table, Model, Column, DataType, Default, BelongsTo, ForeignKey } from "sequelize-typescript";
import Customer from "./customer.model";

@Table({
    tableName: 'reviews'
})

class Review extends Model {

    @Column({
        type: DataType.STRING(100),
        allowNull: false
    })
    description: string
    
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    qualification: number

    // Relación: un Review pertenece a un Customer
    @ForeignKey(() => Customer)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    customerId: number

    @BelongsTo(() => Customer)
    customer: Customer
}

export default Review