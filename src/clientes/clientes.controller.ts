
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { Cliente, TipoUsuario } from './entities/cliente.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUsuario } from '../auth/decorators/get-usuario.decorator';

@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async listarClientes(
    @GetUsuario() usuario: { tipoUsuario: TipoUsuario },
  ): Promise<Cliente[]> {
    return this.clientesService.listarClientes(usuario.tipoUsuario);
  }

  @Post()
  async cadastrarCliente(@Body() dados: CreateClienteDto): Promise<Cliente> {
    return this.clientesService.cadastrarCliente(dados);
  }
}