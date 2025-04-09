import { IsString, IsNotEmpty, IsNumber, Min, IsPositive } from 'class-validator'
import { Transform } from 'class-transformer'

export class CreateProdutoDto {
  @IsString({ message: 'O nome deve ser uma string' })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  nome: string

  @IsString({ message: 'A descrição deve ser uma string' })
  @IsNotEmpty({ message: 'A descrição é obrigatória' })
  descricao: string

  @Transform(({ value }) => parseFloat(value))
  @IsNumber({}, { message: 'O preço deve ser um número' })
  @IsPositive({ message: 'O preço deve ser positivo' })
  preco: number

  @IsString({ message: 'A categoria deve ser uma string' })
  @IsNotEmpty({ message: 'A categoria é obrigatória' })
  categoria: string
}
