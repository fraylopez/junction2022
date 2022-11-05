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
exports.request = void 0;
const axios_1 = __importDefault(require("axios"));
function request(url, options = { method: "get" }) {
    return __awaiter(this, void 0, void 0, function* () {
        const opts = Object.assign(Object.assign({}, options), { url });
        if (opts.params) {
            opts.params = Object.assign(Object.assign({}, opts.params), { format: "json" });
        }
        try {
            const resopose = yield (0, axios_1.default)(opts);
            if (resopose.status <= 300) {
                return resopose.data;
            }
            else {
                throw new Error(resopose.statusText);
            }
        }
        catch (error) {
            throw new Error(error);
        }
    });
}
exports.request = request;
//# sourceMappingURL=HTTPRequester.js.map