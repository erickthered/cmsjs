"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const SettingsSchema = new mongoose_1.Schema({
    googleTagManagerId: {
        type: String,
        trim: true,
    },
    customJs: {
        type: String,
    },
    customCss: {
        type: String,
    },
    maintenanceMode: {
        type: Boolean,
        default: false,
    },
    userRegistration: {
        type: Boolean,
        default: true,
    },
    theme: {
        type: String,
        default: 'default',
    },
    caching: {
        type: Boolean,
        default: false,
    },
});
const Settings = (0, mongoose_1.model)('Settings', SettingsSchema);
exports.default = Settings;
