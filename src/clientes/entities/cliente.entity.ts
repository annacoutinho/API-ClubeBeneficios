import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

export enum TipoUsuario {
  ADMIN = 'admin',
  CLIENTE = 'cliente',
}

@Entity()
export class Cliente {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  nome: string

  @Column({ unique: true })
  email: string

  @Column()
  senha: string

  @Column({
    type: 'enum',
    enum: TipoUsuario,
    default: TipoUsuario.CLIENTE,
  })
  tipoUsuario: TipoUsuario = TipoUsuario.CLIENTE

  @CreateDateColumn()
  criadoEm: Date

  @UpdateDateColumn()
  atualizadoEm: Date
}
