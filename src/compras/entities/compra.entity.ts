import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm'
import { Produto } from '../../produtos/entities/produto.entity'

@Entity()
export class Compra {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  clienteId: number

  @ManyToMany(() => Produto)
  @JoinTable()
  produtos: Produto[]

  @Column()
  status: string

  @Column('decimal', { default: 0 })
  total: number
}
