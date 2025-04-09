import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ClientesService } from '../clientes/clientes.service'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(
    private clientesService: ClientesService,
    private jwtService: JwtService,
  ) {}

  async validateCliente(email: string, senha: string) {
    const cliente = await this.clientesService.findByEmail(email)

    if (!cliente || !(await bcrypt.compare(senha, cliente.senha))) {
      return null
    }

    const { senha: _, ...dadosCliente } = cliente
    return dadosCliente
  }

  async login(cliente: any) {
    const token = this.jwtService.sign({
      sub: cliente.id,
      email: cliente.email,
      tipoUsuario: cliente.tipoUsuario,
    })

    return { access_token: token }
  }
}
