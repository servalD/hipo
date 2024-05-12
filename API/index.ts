import { config } from "dotenv";
import express from "express";
import cors from "cors";
import { MongooseUtils } from "./utils";
import { ModelRegistry } from "./models";
import {VehicleController, CompanyController} from "./contro";


async function launchAPI() {
    const db = await MongooseUtils.open();

    const options: cors.CorsOptions = {
        origin: '*'
    };

    const registry = new ModelRegistry(db);
    const app = express();
    const vehicleController = new VehicleController(registry);
    const companyController = new CompanyController(registry);
    app.use('/vehicle',express.json(), cors(options), vehicleController.buildRoutes());
    app.use('/company',express.json(), cors(options), companyController.buildRoutes());
    app.listen(process.env.PORT, function () {
        console.log('listening on port 3001');
    });
}

config();
launchAPI().catch(console.error);
