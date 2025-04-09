import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from '../auth.service'
import { JwtService } from '@nestjs/jwt'
import { ClientesService } from '../../clientes/clientes.service'
import * as bcrypt from 'bcrypt'

jest.mock('bcrypt')

describe('AuthService', () => {
  let service: AuthService
  let clientesService: Partial<ClientesService>
  let jwtService: Partial<JwtService>

  beforeEach(async () => {
    clientesService = {
      findByEmail: jest.fn().mockResolvedValue({
        id: 1,
        email: 'teste@teste.com',
        senha: 'hashed-password',
        tipoUsuario: 'cliente',
      }),
    }

    jwtService = {
      sign: jest.fn().mockReturnValue('fake-jwt-token'),
    }

    ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: ClientesService, useValue: clientesService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile()

    service = module.get<AuthService>(AuthService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should validate cliente correctly', async () => {
    const result = await service.validateCliente('teste@teste.com', '123456')
    expect(result).toEqual({
      id: 1,
      email: 'teste@teste.com',
      tipoUsuario: 'cliente',
    })
  })

  it('should return null if password is invalid', async () => {
    ;(bcrypt.compare as jest.Mock).mockResolvedValue(false)
    const result = await service.validateCliente(
      'teste@teste.com',
      'wrong-password',
    )
    expect(result).toBeNull()
  })

  it('should return JWT token on login', async () => {
    const result = await service.login({
      id: 1,
      email: 'teste@teste.com',
      tipoUsuario: 'cliente',
    })
    expect(result).toEqual({ access_token: 'fake-jwt-token' })
  })
})
