import { InjectRepository } from "@nestjs/typeorm";
import { Order } from "./entities/order.entity";
import { Repository } from "typeorm";
import { AbstractRepository } from "@app/common/database-postgres/abstract.repository";
import { Logger } from "@nestjs/common";


export class OrderRepository extends AbstractRepository<Order> {
    readonly logger = new Logger(OrderRepository.name);
    constructor(@InjectRepository(Order) private readonly orderRepo: Repository<Order>) {
        super(orderRepo)
    }
}