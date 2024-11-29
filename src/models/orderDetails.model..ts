import { Table, Model, Column, DataType, Default, ForeignKey, BelongsTo } from "sequelize-typescript";
import Order from "./order.model";
import Product from "./product.model";

@Table({
    tableName: 'orderDetails'
})

class OrderDetails extends Model {
    @Default(1)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    quantity: number

    // Relación: OrdenDetails pertenece a Order
    @ForeignKey(() => Order)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    orderId: number

    @BelongsTo(() => Order)
    order: Order

    // Relación: OrdenDetails pertenece a Product
    @ForeignKey(() => Product)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    productId: number
    @BelongsTo(() => Product)
    product: Product
    
}

export default OrderDetails