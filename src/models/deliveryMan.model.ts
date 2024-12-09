import { BelongsTo, Column, DataType, Default, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import Order from "./order.model";
import User from "./user.model";

@Table({
    tableName: 'deliveryMen'
})

class DeliveryMan extends Model{

    @Default(false)
    @Column({
        type: DataType.BOOLEAN,
        allowNull: true
    })

    availability: boolean
    
    @Column({
        type: DataType.STRING(100),
        allowNull: true
    })
    identification: string

    @Default('active')
    @Column({
        type: DataType.ENUM('active', 'inactive'),
        allowNull: true
    })
    status: string

    @Column({
        type: DataType.STRING(10),
        allowNull: false
    })
    phone: string

    // Relación: Customer pertenece a un Usuario
    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    userId: number

    @BelongsTo(() => User)
    user: User

    // Relación: DeliveryMan tiene muchas Orders
    @HasMany(() => Order)
    orders: Order[]
}

export default DeliveryMan