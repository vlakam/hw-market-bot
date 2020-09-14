import { DocumentType, getModelForClass, prop } from '@typegoose/typegoose';
import { Deal } from './Deal';

export class User {
    @prop({ required: true })
    _id!: number;

    @prop({ required: true })
    name!: string;

    @prop({ required: false })
    surname?: string;

    @prop({ required: false })
    username?: string;

    @prop({ ref: () => 'Deal' })
    deals!: Array<Deal>;

    public get id() {
        return this._id;
    }

    public set id(id) {
        this._id = id;
    }

    // constructor(id, name, surname) {
    //     this.id = id;
    //     this.name = name;
    //     this.surname = surname;
    // }

    public getFullName() {
        return `${this.name} ${this.surname}`;
    }

    public getMentionById() {
        return `#id${this.id}`;
    }

    public getMentionByFullNameMarkdown() {
        return `[${this.name} ${this.surname}](tg://user?id=${this.id}) [${this.getMentionById()}]`;
    }

    public getMentionByFullNameHtml() {
        return `<a href="tg://user?id=${this.id}">${this.getFullName()}</a> [${this.getMentionById()}]`;
    }

    public static async findOrCreate(
        user: Pick<User, 'id' | 'name' | 'surname' | 'username'>,
    ): Promise<DocumentType<User>> {
        const { id } = user;
        const maybeUser = await UserModel.findById(id);

        if (maybeUser) return maybeUser;
        else return await UserModel.create({ ...user, deals: [], _id: id });
    }
}

export const UserModel = getModelForClass(User);
