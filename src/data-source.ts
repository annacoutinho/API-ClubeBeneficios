import { DataSource } from 'typeorm'

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'acoutinh',
  password: '123456',
  database: 'clube_beneficios',
  entities: ['src/**/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
})
