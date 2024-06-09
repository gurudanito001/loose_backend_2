
// import bcrypt, { hash } from 'bcrypt';
import sendEmail from "../services/sendEmail";
import { hashPassword, isPasswordMatch } from "../services/authServices";
import { generateToken } from "../services/tokenService";
import { tokenTypes } from "../config/token";
// import config from "../config/config";
import { generateRandomCode } from "../services/generateVerificationCode";
import {prisma} from "../lib/prisma";
// import type { User } from "@prisma/client";
import { uploadImage } from "../services/fileService";
// import nodeFetch from "node-fetch";
import fs, {readFileSync} from "fs";
import path from "path";

const countriesPath = path.join(process.cwd(), 'src/data/countries.json');

class Controller {

  async verifyEmail(req, res){
    const {email} = req.body;
    try {
      // check if user already exists
      let userExists = await prisma.user.findFirst({
        where: {email: email}
      })
      if(userExists){
        return res.status(409).json({
          message: "user with email Already exists",
          status: "error",
          statusCode: 409,
        })
      }

      // generate 4 digit code
      const randomCode = generateRandomCode();
      // check if email has been created in email model
      const emailData = await prisma.email.findFirst({
        where: {email}
      })
      if(emailData?.email){
        //update it with the new verification code
        await prisma.email.update({
          where: {email},
          data: {email: email, code: randomCode}
        })
      }else{
        // save verification code in email model
        await prisma.email.create({
          data: {email: email, code: randomCode}
        })
      }
      // send email to user email
      //await sendEmail({email, code: randomCode});

      return res.status(200).json({
        message: "Verification code will be sent to email",
        status: "success",
        statusCode: 200,
        payload: {
          code: randomCode
        }
      })
    } catch (error) {
      return res.status(400).json({message: error.message})
    }
  }

  async resendVerificationCode(req, res){
    const {email} = req.body;
    try {
      // check if user already exists
      let userExists = await prisma.user.findFirst({
        where: {email: email}
      })
      if(userExists){
        return res.status(409).json({
          message: "User with email Already exists",
          status: "error",
          statusCode: 409,
        })
      }
      // generate 4 digit code
      const randomCode = generateRandomCode();
      // update verification code in email model
      await prisma.email.update({
        where: {email: email},
        data: {code: randomCode}
      })
      // send email to user email
      //await sendEmail({email, code: randomCode});

      return res.status(200).json({
        message: "Verification code has been resent to email",
        status: "success",
        statusCode: 200,
        payload: {
          code: randomCode
        }
      })
    } catch (error) {
      return res.status(400).json({message: error.message})
    }
  }

  async confirmVerificationCode(req, res){
    const {email, code} = req.body;
    try {
      // fetch email data
      let emailData = await prisma.email.findFirst({
        where: {email: email}
      })

      // check if code is valid
      if(emailData?.code !== parseInt(code)){
        return res.status(400).json({
          message: "Invalid code",
          status: "error",
          statusCode: 400,
        })
      }
      if(emailData?.code === code){
        // if valid update the email model and set email as verified
        await prisma.email.update({
          where: {email: emailData.email},
          data: {verified: true}
        })

        return res.status(200).json({
          message: "Email Verification Successful",
          status: "success",
          statusCode: 200,
        })
      }
    } catch (error) {
      return res.status(400).json({message: error.message})
    }
  }

   async register(req, res){
    let {firstName, lastName, email, password, userType, username, country, gender, profileImage, bio, topics} = req.body;
    try {
      // check if email is verified 
      const emailData = await prisma.email.findFirst({
        where: {email: email}
      })
      if(!emailData?.verified){
        return res.status(400).json({
          message: "Email is not verified",
          status: "error",
          statusCode: 400,
        })
      }
      // hash password
      const hashedPassword = await hashPassword(password)

      // save image to cloud
      /* let result = await uploadImage({data: profileImage})
      console.log("image upload result", result) */
      // create user 
      const user = await prisma.user.create({
        data: {firstName, lastName, email, password: hashedPassword, userType, username, country, gender, 
          profileImage: "", 
          bio, topics}
      })

      return res.status(200).json({
        message: "User Registration Successful",
        status: "success",
        statusCode: 200,
        payload: user
      })
    } catch (error) {
      return res.status(400).json({message: error.message})
    }
  }

   async login(req, res){
    let {email, password} = req.body;
    try {
      let user = await prisma.user.findFirst({ where: { email } }); 
      if(!user){
        return res.status(400).json({message: "Email or Password Invalid", status: "error", statusCode: 400,})
      }
      let passwordMatched = await isPasswordMatch(password, user.password);
      if(!passwordMatched){
        return res.status(400).json({message: "Email or Password Invalid"})
      } 
      let token = generateToken({userId: user.id, email, expires: process.env.JWT_ACCESS_EXPIRATION_MINUTES, type: tokenTypes.ACCESS, secret: process.env.SECRET,})

      delete user.password
      return res.status(201).json({
        message: "User Login Successful",
        status: "success",
        statusCode: 200,
        payload: {user, token}
      })
    } catch (error) {
      return res.status(400).json({message: error.message})
    }
  }

   async forgotPassword(req, res){
    let {email} = req.body;
    try {
      let user = await prisma.user.findFirst({where: {email}}) ; 
      if(!user){
        return res.status(404).json({message: 'User with email does not exist'})
      }
      const randomCode = generateRandomCode()
      await prisma.email.update({
        where: {email},
        data: {code: randomCode}
      })
      //await sendEmail({email, code: randomCode})
      return res.status(200).json({
        message: "Verification Code sent to email",
        status: "success",
        statusCode: 200,
        payload: {
          code: randomCode
        }
      })
    } catch (error) {
      return res.status(400).json({message: error.message})
    }
  }

   async resetPassword(req, res){
    let {code, email, newPassword} = req.body;
    try {
      const emailData = await prisma.email.findFirst({
        where: {email}
      })
      if(emailData?.code !== code){
        return res.status(400).json({
          message: "Invalid reset password code",
          status: "error",
          statusCode: 400,
        }) 
      }
      if(emailData?.code === code){
        const hashedPassword = await hashPassword(newPassword);
        await prisma.user.update({
          where: {email},
          data: {password: hashedPassword}
        })
      }

     return res.status(200).json({
        message: "Password Reset Successful",
        status: "success",
        statusCode: 200,
      }) 
    } catch (error) {
      return res.status(400).json({message: error.message})
    }
  }

   async getCountries(req, res){
    try {
      const jsonData =  readFileSync(countriesPath)
      const data = JSON.parse(jsonData.toString());
      return res.status(200).json({
        message: "Countries fetched Successfully",
        status: "success",
        statusCode: 200,
        payload: data
      }) 
    } catch (error) {
      return res.status(400).json({message: error.message})
    }
  }
}

const AuthController = new Controller()
module.exports = AuthController;