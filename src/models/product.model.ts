import { Table, Model, Column, DataType, Default, BelongsTo, ForeignKey, HasMany } from "sequelize-typescript";
import SubCategory from "./subcategory.model";
import OrderDetails from "./orderDetails.model.";

const imgUrlDefault = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MiIgaGVpZ2h0PSI0MiIgdmlld0JveD0iMCAwIDY0IDY0Ij48cGF0aCBmaWxsPSIjODk2NjRjIiBkPSJNMzIgNjRMMCA0NC44VjE5LjJsMzIgMTkuMnoiLz48cGF0aCBmaWxsPSIjZmVkMGFjIiBkPSJNMzIgMzguNFY2NGwzMi0xOS4yVjE5LjJ6Ii8+PHBhdGggZmlsbD0iI2QzOTc2ZSIgZD0ibTAgMTkuMmwzMiAxOS4ybDMyLTE5LjJMMzIgMHoiLz48cGF0aCBmaWxsPSIjODk2NjRjIiBkPSJNNTAuOSAyN0wxOSA3LjhsLTYgMy42bDMyIDE5LjJ6Ii8+PHBhdGggZmlsbD0iI2QwZDBkMCIgZD0ibTM5LjMgNi44bC03LjEtNC40TDI2LjMgNmw3LjEgNC4zeiIvPjxwYXRoIGZpbGw9IiNkMzk3NmUiIGQ9Im01MC44IDI3LjFsLTUuNiAzLjR2OS4ybDUuNi0zLjR6Ii8+PHBhdGggZmlsbD0iI2ZmZiIgZD0ibTYyLjUgMjIuMWwtNS43IDMuNHY5LjJsNS43LTMuNHpNNDEuNiA0My41bC03LjcgNC42djEyLjZsNy43LTQuN3oiLz48cGF0aCBmaWxsPSIjZDM5NzZlIiBkPSJtNDUuMiA1Ni4xbDUuNi0zLjR2LTkuMmwtNS42IDMuNHoiLz48L3N2Zz4="

@Table({
    tableName: 'products'
})

class Product extends Model {
    @Column({
        type: DataType.STRING(100),
        allowNull: false
    })
    name: string

    @Column({
        type: DataType.STRING(15),
        allowNull: false
    })
    nit: number

    @Column({
        type: DataType.TEXT,
        allowNull: true
    })
    description: string

    @Default(imgUrlDefault)
    @Column({
        type: DataType.TEXT,
        allowNull: false
    })
    imgUrl: string

    @Default(true)
    @Column({
        type: DataType.BOOLEAN,
        allowNull: false
        
    })
    availability: boolean 

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false
    })
    priceBefore: number

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false
    })
    priceAfter: number

    @Default(0)
    @Column ({
        type: DataType.FLOAT,
        allowNull: true
    })
    iva: number

    @Default(false)
    @Column ({
        type: DataType.BOOLEAN,
        allowNull: true
    })
    offer: boolean

    // Relación: Product pertenece a  SubCategory
    @ForeignKey(() => SubCategory)
    @Column({
        type: DataType.INTEGER,
        allowNull: true
    })
    subCategoryId: number

    @BelongsTo(() => SubCategory)
    subcategory: SubCategory

    @HasMany(() => OrderDetails, { foreignKey: 'productId' })
    orderDetails: OrderDetails[];  // Relación con OrderDetails
}

export default Product