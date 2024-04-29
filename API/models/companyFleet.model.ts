import {Schema, Types} from "mongoose";
export interface ICompanyFleet{
    name: string;
    IVehicle: [string];
}

export const companyFleetSchema = new Schema<ICompanyFleet>({
    name: {
        type: Schema.Types.String,
        index: true
    },
    IVehicle: {
        type: [Schema.Types.String]
    }
}, {versionKey: false})