import { validate } from 'class-validator'
import { plainToInstance } from 'class-transformer'
import { CreatePagamentoDto } from '../dto/create-pagamento.dto'

describe('CreatePagamentoDto', () => {
  it('deve ser válido quando compraId for um número inteiro', async () => {
    const dto = plainToInstance(CreatePagamentoDto, { compraId: 123 })
    const errors = await validate(dto)
    expect(errors.length).toBe(0)
  })

  it('deve falhar quando compraId estiver vazio', async () => {
    const dto = plainToInstance(CreatePagamentoDto, {})
    const errors = await validate(dto)
    expect(errors.length).toBeGreaterThan(0)
    expect(errors[0].constraints?.isNotEmpty).toBeDefined()
  })

  it('deve falhar quando compraId não for um número inteiro', async () => {
    const dto = plainToInstance(CreatePagamentoDto, { compraId: 'abc' })
    const errors = await validate(dto)
    expect(errors.length).toBeGreaterThan(0)
    expect(errors[0].constraints?.isInt).toBeDefined()
  })
})
