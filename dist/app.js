"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
// import config from './config/config';
const cors_1 = __importDefault(require("cors"));
const auth_controller_1 = __importDefault(require("./controllers/auth.controller"));
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
    res.send("This is your hello message 111");
});
// AUTH
app.post('/auth/verifyEmail', auth_controller_1.default.verifyEmail);
app.post('/auth/resendVerifyCode', auth_controller_1.default.resendVerificationCode);
app.post('/auth/confirmVerification', auth_controller_1.default.confirmVerificationCode);
app.post('/auth/register', auth_controller_1.default.register);
app.post('/auth/login', auth_controller_1.default.login);
app.post('/auth/forgotPassword', auth_controller_1.default.forgotPassword);
app.post('/auth/resetPassword', auth_controller_1.default.resetPassword);
app.get('/auth/getCountries', auth_controller_1.default.getCountries);
//Employee
/* app.post('/employee/create', EmployeeController.create);
app.get('/employee', EmployeeController.getAll);
app.get('/employee/subordinates/:id', EmployeeController.getAllSubordinates);
app.get('/employee/:id', EmployeeController.getOne);
app.put('/employee/:id', EmployeeController.updateOne);
app.delete('/employee/:id', EmployeeController.deleteOne); */
exports.default = app;
//# sourceMappingURL=app.js.map