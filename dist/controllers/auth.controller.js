"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authServices_1 = require("../services/authServices");
const tokenService_1 = require("../services/tokenService");
const token_1 = require("../config/token");
// import config from "../config/config";
const generateVerificationCode_1 = require("../services/generateVerificationCode");
const prisma_1 = require("../lib/prisma");
// import nodeFetch from "node-fetch";
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const countriesPath = path_1.default.join(process.cwd(), 'src/data/countries.json');
class Controller {
    verifyEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            try {
                // check if user already exists
                let userExists = yield prisma_1.prisma.user.findFirst({
                    where: { email: email }
                });
                if (userExists) {
                    return res.status(409).json({
                        message: "user with email Already exists",
                        status: "error",
                        statusCode: 409,
                    });
                }
                // generate 4 digit code
                const randomCode = (0, generateVerificationCode_1.generateRandomCode)();
                // check if email has been created in email model
                const emailData = yield prisma_1.prisma.email.findFirst({
                    where: { email }
                });
                if (emailData === null || emailData === void 0 ? void 0 : emailData.email) {
                    //update it with the new verification code
                    yield prisma_1.prisma.email.update({
                        where: { email },
                        data: { email: email, code: randomCode }
                    });
                }
                else {
                    // save verification code in email model
                    yield prisma_1.prisma.email.create({
                        data: { email: email, code: randomCode }
                    });
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
                });
            }
            catch (error) {
                return res.status(400).json({ message: error.message });
            }
        });
    }
    resendVerificationCode(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            try {
                // check if user already exists
                let userExists = yield prisma_1.prisma.user.findFirst({
                    where: { email: email }
                });
                if (userExists) {
                    return res.status(409).json({
                        message: "User with email Already exists",
                        status: "error",
                        statusCode: 409,
                    });
                }
                // generate 4 digit code
                const randomCode = (0, generateVerificationCode_1.generateRandomCode)();
                // update verification code in email model
                yield prisma_1.prisma.email.update({
                    where: { email: email },
                    data: { code: randomCode }
                });
                // send email to user email
                //await sendEmail({email, code: randomCode});
                return res.status(200).json({
                    message: "Verification code has been resent to email",
                    status: "success",
                    statusCode: 200,
                    payload: {
                        code: randomCode
                    }
                });
            }
            catch (error) {
                return res.status(400).json({ message: error.message });
            }
        });
    }
    confirmVerificationCode(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, code } = req.body;
            try {
                // fetch email data
                let emailData = yield prisma_1.prisma.email.findFirst({
                    where: { email: email }
                });
                // check if code is valid
                if ((emailData === null || emailData === void 0 ? void 0 : emailData.code) !== parseInt(code)) {
                    return res.status(400).json({
                        message: "Invalid code",
                        status: "error",
                        statusCode: 400,
                    });
                }
                if ((emailData === null || emailData === void 0 ? void 0 : emailData.code) === code) {
                    // if valid update the email model and set email as verified
                    yield prisma_1.prisma.email.update({
                        where: { email: emailData.email },
                        data: { verified: true }
                    });
                    return res.status(200).json({
                        message: "Email Verification Successful",
                        status: "success",
                        statusCode: 200,
                    });
                }
            }
            catch (error) {
                return res.status(400).json({ message: error.message });
            }
        });
    }
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { firstName, lastName, email, password, userType, username, country, gender, profileImage, bio, topics } = req.body;
            try {
                // check if email is verified 
                const emailData = yield prisma_1.prisma.email.findFirst({
                    where: { email: email }
                });
                if (!(emailData === null || emailData === void 0 ? void 0 : emailData.verified)) {
                    return res.status(400).json({
                        message: "Email is not verified",
                        status: "error",
                        statusCode: 400,
                    });
                }
                // hash password
                const hashedPassword = yield (0, authServices_1.hashPassword)(password);
                // save image to cloud
                /* let result = await uploadImage({data: profileImage})
                console.log("image upload result", result) */
                // create user 
                const user = yield prisma_1.prisma.user.create({
                    data: { firstName, lastName, email, password: hashedPassword, userType, username, country, gender,
                        profileImage: "",
                        bio, topics }
                });
                return res.status(200).json({
                    message: "User Registration Successful",
                    status: "success",
                    statusCode: 200,
                    payload: user
                });
            }
            catch (error) {
                return res.status(400).json({ message: error.message });
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { email, password } = req.body;
            try {
                let user = yield prisma_1.prisma.user.findFirst({ where: { email } });
                if (!user) {
                    return res.status(400).json({ message: "Email or Password Invalid", status: "error", statusCode: 400, });
                }
                let passwordMatched = yield (0, authServices_1.isPasswordMatch)(password, user.password);
                if (!passwordMatched) {
                    return res.status(400).json({ message: "Email or Password Invalid" });
                }
                let token = (0, tokenService_1.generateToken)({ userId: user.id, email, expires: process.env.JWT_ACCESS_EXPIRATION_MINUTES, type: token_1.tokenTypes.ACCESS, secret: process.env.SECRET, });
                delete user.password;
                return res.status(201).json({
                    message: "User Login Successful",
                    status: "success",
                    statusCode: 200,
                    payload: { user, token }
                });
            }
            catch (error) {
                return res.status(400).json({ message: error.message });
            }
        });
    }
    forgotPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { email } = req.body;
            try {
                let user = yield prisma_1.prisma.user.findFirst({ where: { email } });
                if (!user) {
                    return res.status(404).json({ message: 'User with email does not exist' });
                }
                const randomCode = (0, generateVerificationCode_1.generateRandomCode)();
                yield prisma_1.prisma.email.update({
                    where: { email },
                    data: { code: randomCode }
                });
                //await sendEmail({email, code: randomCode})
                return res.status(200).json({
                    message: "Verification Code sent to email",
                    status: "success",
                    statusCode: 200,
                    payload: {
                        code: randomCode
                    }
                });
            }
            catch (error) {
                return res.status(400).json({ message: error.message });
            }
        });
    }
    resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { code, email, newPassword } = req.body;
            try {
                const emailData = yield prisma_1.prisma.email.findFirst({
                    where: { email }
                });
                if ((emailData === null || emailData === void 0 ? void 0 : emailData.code) !== code) {
                    return res.status(400).json({
                        message: "Invalid reset password code",
                        status: "error",
                        statusCode: 400,
                    });
                }
                if ((emailData === null || emailData === void 0 ? void 0 : emailData.code) === code) {
                    const hashedPassword = yield (0, authServices_1.hashPassword)(newPassword);
                    yield prisma_1.prisma.user.update({
                        where: { email },
                        data: { password: hashedPassword }
                    });
                }
                return res.status(200).json({
                    message: "Password Reset Successful",
                    status: "success",
                    statusCode: 200,
                });
            }
            catch (error) {
                return res.status(400).json({ message: error.message });
            }
        });
    }
    getCountries(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jsonData = (0, fs_1.readFileSync)(countriesPath);
                const data = JSON.parse(jsonData.toString());
                return res.status(200).json({
                    message: "Countries fetched Successfully",
                    status: "success",
                    statusCode: 200,
                    payload: data
                });
            }
            catch (error) {
                return res.status(400).json({ message: error.message });
            }
        });
    }
}
const AuthController = new Controller();
exports.default = AuthController;
//# sourceMappingURL=auth.controller.js.map