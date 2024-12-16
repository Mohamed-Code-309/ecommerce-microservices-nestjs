import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { Logger } from '@nestjs/common';

type SelectField<T> = keyof T extends infer K
    ? K extends string
    ? K | `-${K}` | `+${K}`
    : never
    : never;

export abstract class AbstractRepository<TDocument> {
    protected abstract readonly logger: Logger;
    constructor(protected readonly model: Model<TDocument>) { }

    async create(document: Partial<TDocument>): Promise<TDocument> {
        const createdDocument = new this.model({
            _id: new Types.ObjectId(),
            ...document,
        });

        return (await createdDocument.save()).toJSON() as unknown as TDocument;
    }

    async findOne(
        filterQuery: FilterQuery<TDocument>,
        select?: SelectField<TDocument>[],
    ): Promise<TDocument | null> {
        const document = await this.model
            .findOne(filterQuery)
            .select(select as string[]);

        return document as unknown as TDocument | null;
    }

    async findOneById(
        id: string,
        select?: SelectField<TDocument>[],
    ): Promise<TDocument> {
        return this.findOne({ _id: new Types.ObjectId(id) }, select);
    }

    async find(
        filterQuery: FilterQuery<TDocument>,
        select?: SelectField<TDocument>[],
    ): Promise<TDocument[]> {
        return (await this.model
            .find(filterQuery, {})
            .select(select as string[])) as unknown as TDocument[];
    }

    async findWithPagination(
        page = 1, // default to the first page
        limit = 10, // default to 10 items per page
        filterQuery: FilterQuery<TDocument> = {},
        options: {
            sortBy?: string;
            sortOrder?: 'asc' | 'desc';
            select?: SelectField<TDocument>[];
        } = {},
    ) {
        const { sortBy = 'createdAt', sortOrder = 'desc', select } = options;

        // Calculate skip and limit for pagination
        const skip = (page - 1) * limit;

        // Call the find method with pagination options
        const results = (await this.model
            .find(filterQuery)
            .select(select)
            .skip(skip)
            .sort({ [sortBy]: sortOrder })
            .limit(limit)) as unknown as TDocument[];

        // Count total documents that match the filter criteria
        const total = await this.model.countDocuments(filterQuery);

        // Calculate the total number of pages
        const pages = Math.ceil(total / limit) || 1;

        return { results, total, pages };
    }

    async updateOneById(id: string, update: UpdateQuery<TDocument>) {
        return this.model.findOneAndUpdate({ _id: new Types.ObjectId(id) }, update, { new: true });
    }

    async updateMany(
        filterQuery: FilterQuery<TDocument>,
        update: UpdateQuery<TDocument>,
        options: Record<string, any> = {}
    ): Promise<{ matchedCount: number; modifiedCount: number; acknowledged: boolean }> {
        const result = await this.model.updateMany(filterQuery, update, options);
        return {
            matchedCount: result.matchedCount,
            modifiedCount: result.modifiedCount,
            acknowledged: result.acknowledged,
        };
    }

    async deleteOneById(id: string) {
        return await this.model.findOneAndDelete({ _id: new Types.ObjectId(id) });
    }

    async deleteMany(filterQuery: FilterQuery<TDocument>): Promise<{ deletedCount: number }> {
        const result = await this.model.deleteMany(filterQuery);
        if (result.deletedCount === 0) {
            this.logger.warn(`No documents matched the filter query for deletion.`);
        }
        return { deletedCount: result.deletedCount || 0 };
    }

    async count(filterQuery: FilterQuery<TDocument>) {
        return await this.model.countDocuments(filterQuery);
    }
}
