import { Request, Response } from "express";
import { hashPassword } from "../services/authServices";
import {prisma} from "../lib/prisma";

class Controller {
   async create(req, res){
    let data = req.body;
    try {
      let hashedPassword = await hashPassword(data.password) 
      let newData = { ...data, password: hashedPassword }
      let savedData = await prisma.user.create(newData); 
      if(savedData){
        return res.status(201).json({
          message: "Employee Created Successfully",
          status: "success",
          statusCode: 201,
          payload: savedData
        })
      }
    } catch (error) {
      return res.status(400).json({message: error.message})
    }
  }

   async getAll(req, res){
    let data = req.body;
    try {
      let allData = await prisma.user.findMany({
        orderBy: {
          createdAt: "desc"
        }
      }); 
      if(allData){
        return res.status(200).json({
          message: "Employee Fetched Successfully",
          status: "success",
          statusCode: 200,
          payload: allData
        })
      }
    } catch (error) {
      return res.status(400).json({message: error.message})
    }
  }

  
  
}

const EmployeeController = new Controller()
export default EmployeeController