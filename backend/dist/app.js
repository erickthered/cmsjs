"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const config_1 = __importDefault(require("./config"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = config_1.default.port;
app.get('/', (req, res) => {
    res.send('Hello World!!');
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
