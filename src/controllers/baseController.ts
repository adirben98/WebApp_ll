import { Request,Response } from "express";
import mongoose from "mongoose";
import { AuthRequest } from "./authController";
import User from "../models/userModel";


class BaseController<ModelInterface>{
    model: mongoose.Model<ModelInterface>;

    constructor(model) {
        this.model = model;
    }

    async get(req: Request, res: Response) {
        try {
            if (req.params.id != null || req.params.recepieId != null) {
                if (req.params.id){
                const modelObject = await this.model.findById(req.params.id);
                return res.status(200).send(modelObject);
                }

                else{
                const modelObject = await this.model.find({"recepieId":req.params.recepieId});
                return res.status(200).send(modelObject);
                }
            }
             
            return res.status(404).send()
        } catch (err) {
            res.status(500).send(err.message);
        }
    }

    async post(req: AuthRequest, res: Response) {
       
        try {
            const _id = req.user._id;
            const user= await User.findById({"_id":_id})
            req.body.author = user.full_name
            const modelObject = req.body;
            const newModelObject = await this.model.create(modelObject);
            res.status(201).json(newModelObject);


        } catch (err) {
            res.status(500).send(err.message);
        }
    }

    async edit(req: Request, res: Response) {
        
        try {
            if (req.body){
                const modelObject = req.body;
                const updatedModel = await this.model.findByIdAndUpdate(
                    modelObject._id,
                    modelObject,
                    { new: true }
                );
            res.status(200).json(updatedModel);

            }
            res.status(500).send();
            
            
        } catch (err) {
            res.status(500).send(err.message);
        }
    }

    async delete(req: Request, res: Response) {
        try {
            if (req.body){
                const modelObject = req.body;
                const deletedModel = await this.model.findByIdAndDelete(
                    modelObject._id,
                    modelObject,
                );
            return res.status(200).json(deletedModel);

            }
            return res.status(500).send();

        } catch (err) {
            res.status(500).send(err.message);
        }
    }
}

export default BaseController 