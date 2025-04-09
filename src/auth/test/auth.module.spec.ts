import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from '../auth.service'
import { AuthController } from '../auth.controller'

describe('AuthModule', () => {
  let authService: AuthService
  let authController: AuthController

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            validateCliente: jest
              .fn()
              .mockResolvedValue({ id: 1, email: 'teste@teste.com' }),
            login: jest.fn().mockReturnValue({ access_token: 'fake-token' }),
          },
        },
      ],
    }).compile()

    authService = moduleRef.get<AuthService>(AuthService)
    authController = moduleRef.get<AuthController>(AuthController)
  })

  it('should be defined', () => {
    expect(authController).toBeDefined()
    expect(authService).toBeDefined()
  })

  it('should login successfully', async () => {
    const result = await authController.login({
      email: 'teste@teste.com',
      senha: '123456',
    })

    expect(result).toEqual({ access_token: 'fake-token' })
  })
})
