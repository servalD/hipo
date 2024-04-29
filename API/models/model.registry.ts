import {ICompanyFleet, companyFleetSchema,} from './companyFleet.model'
import {Model, Mongoose} from "mongoose";
import {IVehicle, vehicleSchema} from "./vehicle.model";

export class ModelRegistry{
    mongoose: Mongoose;
    companyFleetModel: Model<ICompanyFleet>;
    vehicleModel: Model<IVehicle>;
    constructor(mongoose: Mongoose) {
        this.mongoose = mongoose;
        this.companyFleetModel = mongoose.model("companyFleet", companyFleetSchema);
        this.vehicleModel = mongoose.model("Vehicle", vehicleSchema);
    }
}