import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import * as bcrypt from 'bcrypt'

import { ClientesRepository } from './repositories/clientes.repository'
import { CreateClienteDto } from './dto/create-cliente.dto'
import { Cliente, TipoUsuario } from './entities/cliente.entity'

@Injectable()
export class ClientesService {
  constructor(private readonly clientesRepo: ClientesRepository) {}

  async findAll(tipoUsuario: TipoUsuario): Promise<Cliente[]> {
    if (tipoUsuario !== TipoUsuario.ADMIN) {
      throw new UnauthorizedException('Apenas administradores podem ver todos os clientes.')
    }

    return this.clientesRepo.findAll()
  }

  async findByEmail(email: string): Promise<Cliente | null> {
    return this.clientesRepo.findByEmail(email)
  }

  async create(data: CreateClienteDto): Promise<Cliente> {
    const clienteExistente = await this.clientesRepo.findByEmail(data.email)

    if (clienteExistente) {
      throw new ConflictException('Este e-mail já está em uso.')
    }

    const senhaCriptografada = await bcrypt.hash(data.senha, 10)

    return this.clientesRepo.create({
      ...data,
      senha: senhaCriptografada,
    })
  }
}
