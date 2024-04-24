"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const grpc = __importStar(require("@grpc/grpc-js"));
const restart_service_1 = require("../../generated/restart_service");
class RestartGrpcClient {
    constructor() {
        this.address = '10.55.0.1';
        this.client = new restart_service_1.RestartClient(`${this.address}:50052`, grpc.credentials.createInsecure());
    }
    updateAddress(newAddress) {
        if (newAddress !== this.address) {
            this.address = newAddress;
            this.client = new restart_service_1.RestartClient(`${this.address}:50052`, grpc.credentials.createInsecure());
            console.log(`Address updated to ${this.address}:50052`);
        }
    }
    restartRequest(request) {
        this.client.RestartProcess(request, (error, response) => {
            if (error) {
                console.error('Error:', error);
                return;
            }
            console.log('Response:', response);
        });
    }
}
exports.default = new RestartGrpcClient();
