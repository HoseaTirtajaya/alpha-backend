import { BeforeCreate, Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'secret_keys'
})
export class SecretKeys extends Model<SecretKeys> {

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    key: string;

    @Column({
        type:DataType.BOOLEAN,
        defaultValue: true
    })
    active_flg: true
}