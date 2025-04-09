import { Test, TestingModule } from '@nestjs/testing'
import { AuthController } from '../auth.controller'
import { AuthService } from '../auth.service'

describe('AuthController', () => {
  let controller: AuthController
  let authService: AuthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            validateCliente: jest
              .fn()
              .mockResolvedValue({ id: 1, email: 'teste@email.com' }),
            login: jest
              .fn()
              .mockReturnValue({ access_token: 'fake-jwt-token' }),
          },
        },
      ],
    }).compile()

    controller = module.get<AuthController>(AuthController)
    authService = module.get<AuthService>(AuthService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('should return access token on valid login', async () => {
    const loginDto = { email: 'teste@email.com', senha: '123456' }
    const result = await controller.login(loginDto)

    expect(authService.validateCliente).toHaveBeenCalledWith(
      loginDto.email,
      loginDto.senha,
    )
    expect(result).toEqual({ access_token: 'fake-jwt-token' })
  })
})
