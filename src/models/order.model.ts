import { Table, Model, Column, DataType, Default, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript";
import Customer from "./customer.model";
import DeliveryMan from "./deliveryMan.model";
import OrderDetails from "./orderDetails.model.";

@Table({
    tableName: 'orders'
})

class Order extends Model {
    @Default('counterDelivery')
    @Column({
        type: DataType.ENUM('counterDelivery', 'credit'),
    })
    paymentMethod: string

    @Default('delivery')
    @Column({
        type: DataType.ENUM('delivery', 'pickup'),
    })
    deliveryType: string

    @Default('inReview')
    @Column({
        type: DataType.ENUM('inReview', 'pending', 'packaging', 'sending', 'ready', 'completed', 'return', 'cancel'),
    })
    status: string

    @Column({
        type: DataType.STRING(150),
        allowNull: false
    })
    address: string

    @Column({
        type: DataType.TEXT
    })
    request: string

    @Column({
        type: DataType.DATE
    })
    completedAt: Date

    // Relación: Order pertenece a Customer
    @ForeignKey(() => Customer)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    customerId: number

    @BelongsTo(() => Customer)
    customer: Customer

    // Relación: Order pertenece a DeliveryMan
    @ForeignKey(() => DeliveryMan)
    @Column({
        type: DataType.INTEGER,
        allowNull: true
    })
    deliveryManId: number

    @BelongsTo(() => DeliveryMan)
    deliveryMan: DeliveryMan

    @HasMany(() => OrderDetails, { foreignKey: 'orderId' })
    orderDetails: OrderDetails[];  // Relación con OrderDetails
}

// paymentMethod - Método de pago / cashOnDelivery (Contra entrega) / prepayment (Pago por adelantado) / credit (Crédito)
// paymentMedium - Médio de pago / bancolombiaQR (Código QR Bancolombia) / cash (Efectivo)

export default Order