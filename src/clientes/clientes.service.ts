import {
  ConflictException,
  Injectable,
  UnauthorizedException,
 } from '@nestjs/common'
 import * as bcrypt from 'bcrypt'
 
 import { ClientesRepository } from './repositories/clientes.repository'
 import { CreateClienteDto } from './dto/create-cliente.dto'
 import { Cliente, TipoUsuario } from './entities/cliente.entity'
 
 export interface ClientesServiceInterface {
  listarClientes(tipo: TipoUsuario): Promise<Cliente[]>
  buscarCliente(email: string): Promise<Cliente | null>
  cadastrarCliente(dados: CreateClienteDto): Promise<Cliente>
 }
 
 @Injectable()
 export class ClientesService implements ClientesServiceInterface {
  constructor(private clientesRepo: ClientesRepository) {}
 
  async listarClientes(tipo: TipoUsuario): Promise<Cliente[]> {
    if (tipo !== TipoUsuario.ADMIN) {
      throw new UnauthorizedException('Somente admins podem acessar esta lista')
    }
 
    return this.clientesRepo.findAll()
  }
 
  async buscarCliente(email: string): Promise<Cliente | null> {
    return this.clientesRepo.findByEmail(email)
  }
 
  async cadastrarCliente(dados: CreateClienteDto): Promise<Cliente> {
    const jaExiste = await this.clientesRepo.findByEmail(dados.email)
 
    if (jaExiste) {
      throw new ConflictException('Email já está sendo usado')
    }
 
    const senhaSegura = await bcrypt.hash(dados.senha, 10)
 
    return this.clientesRepo.create({
      ...dados,
      senha: senhaSegura,
    })
  }
 }