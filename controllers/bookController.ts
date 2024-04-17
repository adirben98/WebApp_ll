import bookmodel from "../models/bookmodel";
import  { Request, Response } from "express";
import mongoose from "mongoose";


const getbook =async (req: Request, res: Response)=> {
    try {
      const book = await bookmodel.findById(req.params.id);
     return res.status(200).send(book);
    } catch (error) {
     return res.status(500).send(error);
}



   export getbook;