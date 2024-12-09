import { Table, Model, Column, DataType, Default, HasMany } from "sequelize-typescript";
import SubCategory from "./subcategory.model";


@Table({
    tableName: 'categories'
})

class Category extends Model {
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

    // Relación: Category tiene muchas SubCategories
    @HasMany(() => SubCategory, {
        onDelete: 'CASCADE', // Eliminar subcategorías al eliminar la categoría
        hooks: true // Activa los hooks para que funcione el 'cascade delete'
    })
    subCategories: SubCategory[];
}

export default Category