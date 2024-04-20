import { Request,Response } from "express";
import mongoose from "mongoose";


class BaseController<ModelInterface>{
    model: mongoose.Model<ModelInterface>;

    constructor(model) {
        this.model = model;
    }

    async get(req: Request, res: Response) {
        try {
            if (req.params.id != null) {
                const modelObject = await this.model.findById(req.params.id);
                return res.status(200).send(modelObject);
            } 
            return res.status(404).send()
        } catch (err) {
            res.status(500).send(err.message);
        }
    }

    async post(req: Request, res: Response) {
       
        try {
            
            const modelObject = req.body;
            const newModelObject = await this.model.create(modelObject);
            res.status(201).json(newModelObject);
        
        //res.status(500).send();


        } catch (err) {
            res.status(500).send(err.message);
        }
    }

    async edit(req: Request, res: Response) {
        
        try {
            if (req.body){
                const modelObject = req.body;
                const updatedStudent = await this.model.findByIdAndUpdate(
                    modelObject._id,
                    modelObject,
                    { new: true }
                );
            return res.status(200).json(updatedStudent);

            }
            return res.status(500).send();
            
            
        } catch (err) {
            res.status(500).send(err.message);
        }
    }

    async delete(req: Request, res: Response) {
        try {
            if (req.body){
                const modelObject = req.body;
                const updatedStudent = await this.model.findByIdAndDelete(
                    modelObject._id,
                    modelObject,
                );
            return res.status(200).json(updatedStudent);

            }
            return res.status(500).send();

        } catch (err) {
            res.status(500).send(err.message);
        }
    }
}

export default BaseController 