import { Table, Model, Column, DataType, HasOne } from "sequelize-typescript";
import Customer from "./customer.model";
import DeliveryMan from "./deliveryMan.model";

@Table({
    tableName: 'users'
})

class User extends Model {

    @Column({
        type: DataType.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        },
        set(value : string) {
            this.setDataValue('email', value.toLowerCase());
        }
    })
    email: string

    @Column({
        type: DataType.STRING(255),
        allowNull: false
    })
    password: string

    @Column({
        type: DataType.STRING(255),
        allowNull: false
    })
    name: string

    @Column({
        type: DataType.ENUM('admin', 'user', 'deliveryman'),
        allowNull: false
    })
    rol: string

    // Relación: User tiene un Customer
    @HasOne(() => Customer)
    customer: Customer

    // Relación: User tiene un DeliveryMan
    @HasOne(() => DeliveryMan)
    deliveryMan: DeliveryMan

}

export default User