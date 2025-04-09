import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PagamentosController } from './pagamentos.controller';
import { PagamentosService } from './pagamentos.service';
import { Compra } from '../compras/entities/compra.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Compra])],
  controllers: [PagamentosController],
  providers: [PagamentosService],
})
export class PagamentosModule {}
