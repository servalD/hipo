import { Schema, Types } from "mongoose";

export interface IVehicle {
    model: string;
    brand: string;
    cost: number;
    //count:
}

export const vehicleSchema = new Schema<IVehicle>({
    model: {
        type: Schema.Types.String,
        index: true,
        required: true,
    },
    brand: {
        type: Schema.Types.String,
        index: true,
        required: true,
    },
    cost: {
        type: Schema.Types.Number,
        required: true,
    },
},{versionKey: false} );
