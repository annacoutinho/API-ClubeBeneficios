import { IsOptional, IsInt, IsDateString, Min } from 'class-validator'
import { Transform } from 'class-transformer'

export class CreateRelatorioDto {
  @IsOptional()
  @IsDateString({}, { message: 'A data inicial deve estar no formato ISO (yyyy-mm-dd)' })
  dataInicial?: string

  @IsOptional()
  @IsDateString({}, { message: 'A data final deve estar no formato ISO (yyyy-mm-dd)' })
  dataFinal?: string

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: 'O ID do produto deve ser um número inteiro' })
  @Min(1, { message: 'O ID do produto deve ser maior que zero' })
  produtoId?: number
}
