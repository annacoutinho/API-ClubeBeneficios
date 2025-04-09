import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ClientesController } from './clientes.controller'
import { ClientesService } from './clientes.service'
import { ClientesRepository } from './repositories/clientes.repository'
import { Cliente } from './entities/cliente.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Cliente])],
  controllers: [ClientesController],
  providers: [ClientesService, ClientesRepository],
  exports: [ClientesService],
})
export class ClientesModule {}
