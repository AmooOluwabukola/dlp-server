import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule,ConfigService } from '@nestjs/config';
import { configOpts } from './config/config';
import { MongooseModule } from '@nestjs/mongoose';


@Module({
  imports: [
    ConfigModule.forRoot(configOpts),
      MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
      }),
      inject: [ConfigService],
    }),
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
