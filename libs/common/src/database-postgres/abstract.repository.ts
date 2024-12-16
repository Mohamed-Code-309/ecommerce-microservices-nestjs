import {
    Repository,
    DeepPartial,
    FindOptionsWhere,
    FindOneOptions,
    FindManyOptions,
    FindOptionsOrder,
} from 'typeorm';
import { NotFoundException, Logger } from '@nestjs/common';

export abstract class AbstractRepository<T extends { id: string }> {
    protected readonly repository: Repository<T>;
    protected abstract readonly logger: Logger;

    protected constructor(entity: Repository<T>) {
        this.repository = entity
    }

    async create(entity: DeepPartial<T>): Promise<T> {
        const newEntity = this.repository.create(entity);
        return await this.repository.save(newEntity);
    }

    public async findOne(options: FindOneOptions<T>): Promise<T> {
        return this.repository.findOne(options)
    }

    public async findOneById(id: any): Promise<T> {
        const options: FindOptionsWhere<T> = {
            id: id
        }
        return await this.repository.findOneBy(options)
    }

    public async findAll(options?: FindManyOptions<T>): Promise<T[]> {
        return await this.repository.find(options)
    }

    async findWithPagination(
        page = 1,
        limit = 10,
        filterQuery: FindOptionsWhere<T> = {},
        options: {
            sortBy?: keyof T;
            sortOrder?: 'ASC' | 'DESC';
            select?: (keyof T)[];
        } = {},
    ): Promise<{
        results: T[];
        total: number;
        pages: number;
    }> {
        const { sortBy = 'createdAt', sortOrder = 'DESC', select } = options;

        const order: FindOptionsOrder<T> = sortBy
            ? { [sortBy]: sortOrder } as FindOptionsOrder<T>
            : undefined;

        const [results, total] = await this.repository.findAndCount({
            where: filterQuery,
            order,
            take: limit,
            skip: (page - 1) * limit,
            select: select ? (select as (keyof T)[]) : undefined,
        });

        return {
            results,
            total,
            pages: Math.ceil(total / limit) || 1,
        };
    }

    async updateOneById(id: string, updateData: DeepPartial<T>): Promise<T> {
        const entity = await this.findOneById(id);
        if (!entity) {
            throw new NotFoundException(`Entity with id ${id} not found`);
        }
        const updatedEntity = Object.assign(entity, updateData);
        return await this.repository.save(updatedEntity)
    }

    async updateMany(
        filterQuery: FindOptionsWhere<T>,
        updateData: any,
    ): Promise<{ affected: number }> {
        const result = await this.repository.update(filterQuery, updateData);
        return { affected: result.affected || 0 };
    }

    async deleteOneById(id: string): Promise<void> {
        const result = await this.repository.delete(id);
        if (result.affected === 0) {
            this.logger.warn(`Entity not found with id: ${id}`);
            throw new NotFoundException('Entity not found');
        }
    }

    async deleteMany(filterQuery: FindOptionsWhere<T>): Promise<{ affected: number }> {
        const result = await this.repository.delete(filterQuery);
        if (result.affected === 0) {
            this.logger.warn(`No entities matched the filter query for deletion.`);
        }
        return { affected: result.affected || 0 };
    }

    async count(filterQuery: FindOptionsWhere<T>): Promise<number> {
        return await this.repository.count({ where: filterQuery });
    }
}
