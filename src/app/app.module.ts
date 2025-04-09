import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CacheModule } from '@nestjs/cache-manager'

import * as redisStore from 'cache-manager-ioredis'

import { ClientesModule } from '../clientes/clientes.module'
import { ProdutosModule } from '../produtos/produtos.module'
import { ComprasModule } from '../compras/compras.module'
import { AuthModule } from '../auth/auth.module'
import { RelatoriosModule } from '../relatorios/relatorios.module'
import { PagamentosModule } from '../pagamentos/pagamentos.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        store: redisStore,
        host: config.get('REDIS_HOST'),
        port: config.get('REDIS_PORT'),
        ttl: 60,
      }),
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: config.get('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),

    ClientesModule,
    ProdutosModule,
    ComprasModule,
    AuthModule,
    RelatoriosModule,
    PagamentosModule,
  ],
})
export class AppModule {}
