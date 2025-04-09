import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ComprasService } from './compras.service'
import { ComprasController } from './compras.controller'
import { Compra } from './entities/compra.entity'
import { Produto } from 'src/produtos/entities/produto.entity'
import { Cliente } from 'src/clientes/entities/cliente.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Compra, Cliente, Produto])],
  controllers: [ComprasController],
  providers: [ComprasService],
})
export class ComprasModule {}
