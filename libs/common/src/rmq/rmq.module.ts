import { DynamicModule, Module } from '@nestjs/common';
import { RmqService } from './rmq.service';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';


interface RmqModuleOptions {
    name: string;
    // sync: boolean;
}

@Module({
    providers: [RmqService],
    exports: [RmqService],
})
export class RmqModule {
    static register(rmqOptions: RmqModuleOptions[]): DynamicModule {
        const createRmqClient = ({ name }: RmqModuleOptions): any => ({
            name,
            useFactory: (configService: ConfigService) => ({
                transport: Transport.RMQ,
                options: {
                    urls: [configService.get<string>('RABBIT_MQ_URI')],
                    queue: name
                }
            }),
            inject: [ConfigService]
        });
        const clients = rmqOptions.map(createRmqClient);

        return {
            module: RmqModule,
            imports: [ClientsModule.registerAsync(clients)],
            exports: [ClientsModule]
        };
    }
}