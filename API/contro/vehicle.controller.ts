import { ModelRegistry } from "../models";
import express, { Router, Request, Response } from "express";

export class VehicleController {
    constructor(private modelRegistry: ModelRegistry) {
    }
    async add(req: Request, res: Response) {
        try {
            const vehicleData = req.body;
            const newVehicle = new this.modelRegistry.vehicleModel(vehicleData);
            await newVehicle.save();
            res.status(201).json(newVehicle);
        } catch (error) {
            res.status(500).end();
            console.log(error);
        }
    }
    async getAll(req: Request, res: Response) {
        try {
            const vehicle = await this.modelRegistry.vehicleModel.find();
            res.json(vehicle);
        } catch (error) {
            res.status(500).end();
            console.log(error);
        }
    }
    async getById(req: Request, res: Response) {
        const id = req.params.id;
        try {
            const vehicle = await this.modelRegistry.vehicleModel.findById(id);
            res.json(vehicle);
        } catch (error) {
            res.status(500).end();
            console.log(error);
        }
    }
    async update(req: Request, res: Response) {
        try {
            const vehicleId = req.params.id;
            const updatedVehicle = await this.modelRegistry.vehicleModel.findByIdAndUpdate(vehicleId, req.body, { new: true });
            if (!updatedVehicle) {
                res.status(404).json({ message: "vehicle not found" });
            } else {
                res.json(updatedVehicle);
            }
        } catch (error) {
            res.status(500).end();
            console.log(error);
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const vehicleId = req.params.id;
            const deletedVehicle = await this.modelRegistry.vehicleModel.findByIdAndDelete(vehicleId);
            if (!deletedVehicle) {
                res.status(404).json({ message: "vehicle not found" });
            } else {
                res.json({ message: "vehicle deleted successfully" });
            }
        } catch (error) {
            res.status(500).end();
            console.log(error);
        }
    }


    buildRoutes(): Router {
        const router = express.Router();
        router.post('/add', this.add.bind(this));
        router.get('/get', this.getAll.bind(this));
        router.put('/update/:id', this.update.bind(this));
        router.delete('/delete/:id', this.delete.bind(this));
        router.get('/getbyid/:id', this.getById.bind(this));
        return router;
    }
}
