import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Cliente } from '../entities/cliente.entity'

@Injectable()
export class ClientesRepository {
  constructor(
    @InjectRepository(Cliente)
    private readonly repo: Repository<Cliente>,
  ) {}

  findAll(): Promise<Cliente[]> {
    return this.repo.find()
  }

  findByEmail(email: string): Promise<Cliente | null> {
    return this.repo.findOne({ where: { email } })
  }

  create(cliente: Partial<Cliente>): Promise<Cliente> {
    const novo = this.repo.create(cliente)
    return this.repo.save(novo)
  }
}
