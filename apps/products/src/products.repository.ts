import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "./entities/product.entity";
import { Repository } from "typeorm";
import { AbstractRepository } from "@app/common/database-postgres/abstract.repository";
import { Logger } from "@nestjs/common";


export class ProductRepository extends AbstractRepository<Product> {
    readonly logger = new Logger(ProductRepository.name);
    constructor(@InjectRepository(Product) private readonly productRepo: Repository<Product>) {
        super(productRepo)
    }
}