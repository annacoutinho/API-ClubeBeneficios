import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '../src/app/app.module'

describe('Teste de Integridade do Projeto', () => {
  let app: INestApplication

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = module.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('deve iniciar a aplicação sem erros', async () => {
    expect(app).toBeDefined()
  })

  it('deve carregar os módulos principais', () => {
    const appModule = app.get(AppModule)
    expect(appModule).toBeDefined()
  })
})
