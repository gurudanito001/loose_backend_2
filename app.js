import express, { Express, Request, Response} from 'express';
import bodyParser from 'body-parser';
// import config from './config/config';
import cors from 'cors';
import AuthController from './controllers/auth.controller';


const app = express();

app.use(bodyParser.json({limit: '50mb'})); // define the size limit
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));	// define the size limit
app.use(express.json());
app.use(cors());

//Testing
app.get('/', (req, res) =>{
  res.send("Therapy Application")
})

app.get("/hello", (req, res) => {
  res.send("This is your hello message");
})

// AUTH
app.post('/auth/verifyEmail', AuthController.verifyEmail);
app.post('/auth/resendVerifyCode', AuthController.resendVerificationCode);
app.post('/auth/confirmVerification', AuthController.confirmVerificationCode);
app.post('/auth/register', AuthController.register);
app.post('/auth/login', AuthController.login);
app.post('/auth/forgotPassword', AuthController.forgotPassword);
app.post('/auth/resetPassword', AuthController.resetPassword);
app.get('/auth/getCountries', AuthController.getCountries);

//Employee
/* app.post('/employee/create', EmployeeController.create);
app.get('/employee', EmployeeController.getAll);
app.get('/employee/subordinates/:id', EmployeeController.getAllSubordinates);
app.get('/employee/:id', EmployeeController.getOne);
app.put('/employee/:id', EmployeeController.updateOne);
app.delete('/employee/:id', EmployeeController.deleteOne); */




module.exports = app;
