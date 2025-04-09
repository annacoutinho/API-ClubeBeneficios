import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator'
import { TipoUsuario } from '../entities/cliente.entity'

export class CreateClienteDto {
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  @IsString({ message: 'O nome deve ser uma string.' })
  nome: string

  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  @IsEmail({}, { message: 'Formato de e-mail inválido.' })
  email: string

  @IsNotEmpty({ message: 'A senha é obrigatória.' })
  @IsString({ message: 'A senha deve ser uma string.' })
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres.' })
  senha: string

  @IsEnum(TipoUsuario, { message: 'Tipo de usuário inválido.' })
  tipoUsuario: TipoUsuario
}
