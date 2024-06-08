"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
// import config from './config/config';
const cors_1 = __importDefault(require("cors"));
//import AuthController from './controllers/auth.controller';
const app = (0, express_1.default)();
app.use(body_parser_1.default.json({ limit: '50mb' })); // define the size limit
app.use(body_parser_1.default.urlencoded({ limit: '50mb', extended: true })); // define the size limit
app.use(express_1.default.json());
app.use((0, cors_1.default)());
//Testing
app.get('/', (req, res) => {
    res.send("Therapy Application");
});
app.get("/hello", (req, res) => {
    res.send("This is your hello message");
});
// AUTH
/* app.post('/auth/verifyEmail', AuthController.verifyEmail);
app.post('/auth/resendVerifyCode', AuthController.resendVerificationCode);
app.post('/auth/confirmVerification', AuthController.confirmVerificationCode);
app.post('/auth/register', AuthController.register);
app.post('/auth/login', AuthController.login);
app.post('/auth/forgotPassword', AuthController.forgotPassword);
app.post('/auth/resetPassword', AuthController.resetPassword);
app.get('/auth/getCountries', AuthController.getCountries); */
//Employee
/* app.post('/employee/create', EmployeeController.create);
app.get('/employee', EmployeeController.getAll);
app.get('/employee/subordinates/:id', EmployeeController.getAllSubordinates);
app.get('/employee/:id', EmployeeController.getOne);
app.put('/employee/:id', EmployeeController.updateOne);
app.delete('/employee/:id', EmployeeController.deleteOne); */
exports.default = app;
//# sourceMappingURL=app.js.map