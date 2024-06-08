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
Object.defineProperty(exports, "__esModule", { value: true });
const authServices_1 = require("../services/authServices");
const prisma_1 = require("../../lib/prisma");
class Controller {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = req.body;
            try {
                let hashedPassword = yield (0, authServices_1.hashPassword)(data.password);
                let newData = Object.assign(Object.assign({}, data), { password: hashedPassword });
                let savedData = yield prisma_1.prisma.user.create(newData);
                if (savedData) {
                    return res.status(201).json({
                        message: "Employee Created Successfully",
                        status: "success",
                        statusCode: 201,
                        payload: savedData
                    });
                }
            }
            catch (error) {
                return res.status(400).json({ message: error.message });
            }
        });
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = req.body;
            try {
                let allData = yield prisma_1.prisma.user.findMany({
                    orderBy: {
                        createdAt: "desc"
                    }
                });
                if (allData) {
                    return res.status(200).json({
                        message: "Employee Fetched Successfully",
                        status: "success",
                        statusCode: 200,
                        payload: allData
                    });
                }
            }
            catch (error) {
                return res.status(400).json({ message: error.message });
            }
        });
    }
}
const EmployeeController = new Controller();
exports.default = EmployeeController;
//# sourceMappingURL=employee.controller.js.map