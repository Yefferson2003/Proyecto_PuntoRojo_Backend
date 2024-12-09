import { Column, DataType, Default, Model, Table } from "sequelize-typescript";

@Table({
    tableName: 'messages'
})

class Message extends Model {

    @Default(false)
    @Column({
        type: DataType.BOOLEAN,
        allowNull: true
    })
    visibility: boolean

    @Column({
        type: DataType.TEXT,
        allowNull: true
    })
    message: string
}

export default Message