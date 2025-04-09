import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RelatoriosService } from './relatorios.service'
import { RelatoriosController } from './relatorios.controller'

import { Produto } from '../produtos/entities/produto.entity'
import { Compra } from '../compras/entities/compra.entity'
@Module({
  imports: [TypeOrmModule.forFeature([Produto, Compra])],
  providers: [RelatoriosService],
  controllers: [RelatoriosController],
})
export class RelatoriosModule {}
