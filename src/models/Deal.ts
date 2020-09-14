import { getModelForClass, prop } from '@typegoose/typegoose';
import { User } from './User';

export enum DealStatus {
    DONE = 'done',
    DECLINED = 'declined',
    REVIEW = 'review',
    PUBLISHED = 'published',
}

export class Deal {
    @prop({ required: true })
    title!: string;

    @prop({ required: true })
    description!: string;

    @prop({ required: true, ref: () => 'User', type: Number })
    creator!: User;

    @prop()
    media?: string;

    @prop()
    moderationMessageId?: number;

    @prop({ enum: DealStatus, type: String, default: DealStatus.REVIEW })
    status?: DealStatus;

    @prop({ ref: () => 'User', type: Number })
    reviewedBy?: User;

    // @prop({required: true})
    // userMessageId!: number;
}

export const DealModel = getModelForClass(Deal);
