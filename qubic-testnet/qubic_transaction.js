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
var QubicHelper_js_1 = require("@qubic-lib/qubic-ts-library/dist/QubicHelper.js");
var QubicConnector_js_1 = require("@qubic-lib/qubic-ts-library/dist/QubicConnector.js");
var QubicTransaction_js_1 = require("@qubic-lib/qubic-ts-library/dist/Qubic-types/QubicTransaction.js");
var PublicKey_js_1 = require("@qubic-lib/qubic-ts-library/dist/qubic-types/PublicKey.js");
var Long_js_1 = require("@qubic-lib/qubic-ts-library/dist/qubic-types/Long.js");
function generarSeed(longitud) {
    if (longitud === void 0) { longitud = 58; }
    var letras = 'abcdefghijklmnopqrstuvwxyz';
    return Array.from({ length: longitud }, function () { return letras.charAt(Math.floor(Math.random() * letras.length)); }).join('');
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var helper, seedEmisor, idEmisor, seedReceptor, idReceptor, rpcUrl, connector, status, currentTick, targetTick, tx, encodedTx, res, resData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    helper = new QubicHelper_js_1.QubicHelper();
                    seedEmisor = generarSeed();
                    return [4 /*yield*/, helper.createIdPackage(seedEmisor)];
                case 1:
                    idEmisor = _a.sent();
                    seedReceptor = generarSeed();
                    return [4 /*yield*/, helper.createIdPackage(seedReceptor)];
                case 2:
                    idReceptor = _a.sent();
                    console.log('Seed Emisor:', seedEmisor);
                    console.log('ID Emisor:', idEmisor.publicId);
                    console.log('Seed Receptor:', seedReceptor);
                    console.log('ID Receptor:', idReceptor.publicId);
                    rpcUrl = 'https://testnet-rpc.qubic.org';
                    connector = new QubicConnector_js_1.QubicConnector(rpcUrl);
                    return [4 /*yield*/, connector.getRPCStatus()];
                case 3:
                    status = _a.sent();
                    currentTick = status.lastProcessedTick.tickNumber;
                    targetTick = currentTick + 10;
                    tx = new QubicTransaction_js_1.QubicTransaction()
                        .setSourcePublicKey(new PublicKey_js_1.PublicKey(idEmisor.publicId))
                        .setDestinationPublicKey(new PublicKey_js_1.PublicKey(idReceptor.publicId))
                        .setAmount(new Long_js_1.Long(100))
                        .setTick(targetTick)
                        .setInputType(0)
                        .setInputSize(0);
                    return [4 /*yield*/, tx.build(seedEmisor)];
                case 4:
                    _a.sent();
                    encodedTx = tx.encodeTransactionToBase64(tx.getPackageData());
                    return [4 /*yield*/, fetch("".concat(rpcUrl, "/v1/broadcast-transaction"), {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ encodedTransaction: encodedTx }),
                        })];
                case 5:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                case 6:
                    resData = _a.sent();
                    if (res.ok) {
                        console.log('✅ Transacción enviada con éxito');
                        console.log('Transaction ID:', resData.transactionId);
                        console.log('Tick programado:', targetTick);
                    }
                    else {
                        console.error('❌ Error al enviar transacción:', resData);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
main().catch(console.error);
