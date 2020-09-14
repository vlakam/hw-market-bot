import { mongoose } from '@typegoose/typegoose';

export const connect = async (mongo?: string) => {
    if (!mongo) throw 'No mongo specified';
    
    return mongoose.connect(mongo, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
    });
};

export * from './Deal';
export * from './User';