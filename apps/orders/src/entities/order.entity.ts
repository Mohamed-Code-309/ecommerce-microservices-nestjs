import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { OrderItem } from './order-item.entity';
import { EOrderPayment } from '../enums/payment.enum';
import { EOrderStatus } from '../enums/status.enum';

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    userId: string;

    @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
    items: OrderItem[];

    @Column({
        type: 'enum',
        enum: EOrderStatus,
        default: EOrderStatus.PENDING
    })
    status: EOrderStatus;

    @Column({
        type: 'enum',
        enum: EOrderPayment
    })
    paymentMethod: EOrderPayment;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    totalAmount: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
