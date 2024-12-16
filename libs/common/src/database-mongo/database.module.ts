import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';



@Module({})
export class DatabaseModule {

  static register(): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [MongooseModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService): any => ({
            uri: configService.get<string>('MONGODB_URI')
        })
      })
      ],
    };
  }
}
