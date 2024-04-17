import { Request,Response } from "express";
import mongoose from "mongoose";

class baseController {

}

const createController = () =>new baseController();

export default createController;