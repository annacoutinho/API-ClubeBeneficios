import { IsInt, IsNotEmpty } from 'class-validator'
import { Transform } from 'class-transformer'

export class CreatePagamentoDto {
  @IsNotEmpty({ message: 'Por favor, informe o ID da compra.' })
  @IsInt({ message: 'O ID da compra precisa ser um número inteiro.' })
  @Transform(({ value }) => parseInt(value, 10))
  compraId: number
}
