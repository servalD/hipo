import * as mongoose from "mongoose";

export class MongooseUtils {
    static async open(): Promise<any> {
        return  mongoose.connect(process.env.MONGODB_URI as string, {
            auth: {
                username: process.env.MONGODB_USR,
                password: process.env.MONGODB_PW
            },
            authSource: 'admin'
        });
    }
}
