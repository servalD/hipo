import { ModelRegistry } from "../models";
import express, { Router, Request, Response } from "express";

export class CompanyController {
    constructor(private modelRegistry: ModelRegistry) {
    }
    async add(req: Request, res: Response) {
        try {
            const companyData = req.body;
            const newCompany = new this.modelRegistry.companyFleetModel(companyData);
            await newCompany.save();
            res.status(201).json(newCompany);
        } catch (error) {
            res.status(500).end();
            console.log(error);
        }
    }
    async getAll(req: Request, res: Response) {
        try {
            const company = await this.modelRegistry.companyFleetModel.find();
            res.json(company);
        } catch (error) {
            res.status(500).end();
            console.log(error);
        }
    }
    async getById(req: Request, res: Response) {
        const id = req.params.id;
        try {
            const company = await this.modelRegistry.companyFleetModel.findById(id);
            res.json(company);
        } catch (error) {
            res.status(500).end();
            console.log(error);
        }
    }
    async update(req: Request, res: Response) {
        try {
            const companyId = req.params.id;
            const updatedCompany = await this.modelRegistry.companyFleetModel.findByIdAndUpdate(companyId, req.body, { new: true });
            if (!updatedCompany) {
                res.status(404).json({ message: "company not found" });
            } else {
                res.json(updatedCompany);
            }
        } catch (error) {
            res.status(500).end();
            console.log(error);
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const companyId = req.params.id;
            const deletedCompany = await this.modelRegistry.companyFleetModel.findByIdAndDelete(companyId);
            if (!deletedCompany) {
                res.status(404).json({ message: "company not found" });
            } else {
                res.json({ message: "company deleted successfully" });
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
