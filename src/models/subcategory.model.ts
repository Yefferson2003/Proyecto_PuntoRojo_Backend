import { Table, Model, Column, DataType, Default, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript";
import Category from "./category.model";
import Product from "./product.model";

@Table({
    tableName: 'subCategories'
})

class SubCategory extends Model {
    @Column({
        type: DataType.STRING(100),
        allowNull: false
    })
    name: string

    @Default(true)
    @Column({
        type: DataType.BOOLEAN
    })
    visibility: boolean

    // Relación: SubCategory pertenece a Category
    @ForeignKey(() => Category)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    categoryId: number;

    @BelongsTo(() => Category)
    category: Category;
    
    // Relación: SubCategory tiene muchos Products
    @HasMany(() => Product)
    products: Product[]
}

export default SubCategory