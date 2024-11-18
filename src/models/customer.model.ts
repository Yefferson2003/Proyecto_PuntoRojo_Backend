
import { Table, Model, Column, DataType, Default, HasMany, HasOne, ForeignKey, BelongsTo, IsLowercase } from "sequelize-typescript";
import Order from "./order.model";
import Review from "./review.model";
import User from "./user.model";
import Token from "./token.model";

@Table({
    tableName: 'customers'
})

class Customer extends Model {

    @Default('natural')
    @Column({
        type: DataType.ENUM('natural', 'legal',),
        allowNull: false
    })
    clietType: string

    @Column({
        type: DataType.STRING(20),
        allowNull: false
    })
    identification: string

    @Column({
        type: DataType.STRING(10),
        allowNull: false
    })
    phone: string

    @Column({
        type: DataType.STRING(255),
        allowNull: false,
    })
    address: string

    @Default(false)
    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
    })
    confirmed: boolean

    // Relación: Customer pertenece a un Usuario
    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    userId: number

    @BelongsTo(() => User)
    user: User

    // Relación: Customer tiene muchas Orders
    @HasMany(() => Order)
    orders: Order[]

    @HasOne(() => Review)
    review: Review

    @HasOne(() => Token)
    token: Token
}

export default Customer