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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var dotenv_1 = require("dotenv");
var passport_1 = require("passport");
var mongoose_1 = require("mongoose");
var path_1 = require("path");
var config_1 = require("./config/config");
var index_1 = require("./models/index");
var swagger_1 = require("./swagger");
require("./passport/passport"); // Ensure passport is configured before routes
var auth_1 = require("./routes/v1/admin/auth"); // Use the correct route file
//import adminAuth from "./routes/v1/admin/auth"; // Use the correct route file
var patients_1 = require("./routes/v1/admin/patients");
var users_1 = require("./routes/v1/admin/users");
var inventories_1 = require("./routes/v1/admin/inventories");
var appointments_1 = require("./routes/v1/admin/appointments");
var appointments_2 = require("./routes/v1/doctor/appointments");
var patient_1 = require("./routes/v1/doctor/patient");
var followUps_1 = require("./routes/v1/admin/followUps");
var followUps_2 = require("./routes/v1/doctor/followUps");
var billings_1 = require("./routes/v1/admin/billings");
var payments_1 = require("./routes/v1/admin/payments");
var auth_2 = require("./routes/v1/doctor/auth");
var auth_3 = require("./routes/v1/nurse/auth");
var appointments_3 = require("./routes/v1/nurse/appointments");
var auth_4 = require("./routes/v1/receptionist/auth");
var patients_2 = require("./routes/v1/receptionist/patients");
var appointments_4 = require("./routes/v1/receptionist/appointments");
var patients_3 = require("./routes/v1/nurse/patients");
//import ngrok from "ngrok";
dotenv_1.default.config();
var app = (0, express_1.default)();
app.use(express_1.default.json()); // Enable JSON parsing
app.use(passport_1.default.initialize()); // Initialize Passport.js//
// Connect to MongoDB using Mongoose
mongoose_1.default
    .connect(config_1.config.MONGODB_URI)
    .then(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("Connected to MongoDB");
                return [4 /*yield*/, (0, index_1.initializeModels)()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); })
    .catch(function (err) { return console.error("Error connecting to MongoDB:", err); });
app.use("/v1", auth_1.default);
app.use("/v1", auth_2.default);
app.use("/v1/doctor/followups", followUps_2.default);
app.use("/v1/doctor/appointments", appointments_2.default);
app.use("/v1/doctor/patients", patient_1.default);
app.use("/v1/admin/patients", patients_1.default);
app.use("/v1/admin/users", users_1.default);
app.use("/v1/admin/inventory", inventories_1.default);
app.use("/v1/admin/appointments", appointments_1.default);
app.use("/v1/admin/followUps", followUps_1.default);
app.use("/v1/admin/billings", billings_1.default);
app.use("/v1/admin/payments", payments_1.default);
app.use("/v1", auth_4.default);
app.use("/v1/receptionist/patients", patients_2.default);
app.use("/v1/receptionist/appointments", appointments_4.default);
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/v1", auth_3.default);
app.use("/v1/nurse/appointments", appointments_3.default);
app.use("/v1/nurse/patients", patients_3.default);
// app.use((req, res, next) => {
//   res.setHeader("ngrok-skip-browser-warning", "true");
//   next();
// });
app.use("/v1/swagger/", swagger_1.swaggerUi.serve, swagger_1.swaggerUi.setup(swagger_1.swaggerSpec, { explorer: true }));
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
// Swagger API Documentation
app.use("/v1/swagger", swagger_1.swaggerUi.serve, swagger_1.swaggerUi.setup(swagger_1.swaggerSpec, { explorer: true }));
// Use authentication routes// Ensure route prefix is added
//add
var port = config_1.config.PORT || 8000;
//app.listen(port, () => console.log(`🚀 Server running on http://localhost:${port}`));
app.listen(port, function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        console.log("Server is running on http://localhost:".concat(port));
        return [2 /*return*/];
    });
}); });
