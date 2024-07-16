import { Request, Response } from "express";
import mongoose from "mongoose";
import { AuthRequest } from "./authController";
import User, { IUser } from "../models/userModel";

class BaseController<ModelInterface> {
  model: mongoose.Model<ModelInterface>;

  constructor(model) {
    this.model = model;
  }

  async get(req: AuthRequest, res: Response) {
    try {
      let user: IUser;
      if (req.user) {
        user = await User.findById({ _id: req.user._id });
      }
      if (
        req.params.id != null ||
        req.params.recipeId != null ||
        user != null
      ) {
        if (req.params.id) {
          const modelObject = await this.model.findById(req.params.id);
          if (modelObject !== null) {
            return res.status(200).send(modelObject);
          }
        } else if (req.params.recipeId) {
          const modelObject = await this.model.find({
            recipeId: req.params.recipeId,
          });
          if (modelObject !== null) {
            return res.status(200).send(modelObject.reverse());
          }
        } else {
          const modelObject = await this.model.find({ author: user.username });
          return res.status(200).send(modelObject.reverse());
        }
      }

      return res.status(404).send();
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  async post(req: AuthRequest, res: Response) {
    try {
      const _id = req.user._id;
      const user = await User.findById({ _id: _id });
      const modelObject = req.body;
      modelObject.author = user.username;
      const newModelObject = await this.model.create(modelObject);
      res.status(201).json(newModelObject);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  async edit(req: AuthRequest, res: Response) {
    try {
      if (req.body) {
        const modelObject = req.body;
        const updatedModel = await this.model.findByIdAndUpdate(
          modelObject._id,
          modelObject,
          { new: true }
        );
        res.status(200).json(updatedModel);
      }
      res.status(400).send();
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      if (req.params.id != null) {
        await this.model.findByIdAndDelete({ _id: req.params.id });
        return res.status(200).send();
      }
      return res.status(400).send();
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
}

export default BaseController;
