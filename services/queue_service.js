"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var QueueService = /** @class */ (function () {
    function QueueService(bullmq) {
        this.bullmq = bullmq;
    }
    /**
     * Dispatch a job to a queue
     */
    QueueService.prototype.dispatch = function (queueName_1, jobType_1, data_1) {
        return __awaiter(this, arguments, void 0, function (queueName, jobType, data, options) {
            var queue, jobData;
            if (options === void 0) { options = {}; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        queue = this.bullmq.queue(queueName);
                        jobData = __assign(__assign({}, data), { __jobType: jobType });
                        return [4 /*yield*/, queue.add(jobType, jobData, options)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Dispatch a job to the default queue
     */
    QueueService.prototype.dispatchToDefault = function (jobType_1, data_1) {
        return __awaiter(this, arguments, void 0, function (jobType, data, options) {
            if (options === void 0) { options = {}; }
            return __generator(this, function (_a) {
                return [2 /*return*/, this.dispatch('default', jobType, data, options)];
            });
        });
    };
    /**
     * Schedule a job to run later
     */
    QueueService.prototype.schedule = function (queueName_1, jobType_1, data_1, delay_1) {
        return __awaiter(this, arguments, void 0, function (queueName, jobType, data, delay, options) {
            if (options === void 0) { options = {}; }
            return __generator(this, function (_a) {
                return [2 /*return*/, this.dispatch(queueName, jobType, data, __assign(__assign({}, options), { delay: delay }))];
            });
        });
    };
    /**
     * Schedule a job on default queue
     */
    QueueService.prototype.scheduleOnDefault = function (jobType_1, data_1, delay_1) {
        return __awaiter(this, arguments, void 0, function (jobType, data, delay, options) {
            if (options === void 0) { options = {}; }
            return __generator(this, function (_a) {
                return [2 /*return*/, this.schedule('default', jobType, data, delay, options)];
            });
        });
    };
    /**
     * Get queue statistics
     */
    QueueService.prototype.getQueueStats = function (queueName) {
        return __awaiter(this, void 0, void 0, function () {
            var queue;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        queue = this.bullmq.queue(queueName);
                        _a = {};
                        return [4 /*yield*/, queue.getWaiting()];
                    case 1:
                        _a.waiting = _b.sent();
                        return [4 /*yield*/, queue.getActive()];
                    case 2:
                        _a.active = _b.sent();
                        return [4 /*yield*/, queue.getCompleted()];
                    case 3:
                        _a.completed = _b.sent();
                        return [4 /*yield*/, queue.getFailed()];
                    case 4:
                        _a.failed = _b.sent();
                        return [4 /*yield*/, queue.getDelayed()];
                    case 5: return [2 /*return*/, (_a.delayed = _b.sent(),
                            _a)];
                }
            });
        });
    };
    /**
     * Clean a queue
     */
    QueueService.prototype.cleanQueue = function (queueName_1) {
        return __awaiter(this, arguments, void 0, function (queueName, grace, limit, type) {
            var queue;
            if (grace === void 0) { grace = 0; }
            if (limit === void 0) { limit = 100; }
            if (type === void 0) { type = 'completed'; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        queue = this.bullmq.queue(queueName);
                        return [4 /*yield*/, queue.clean(grace, limit, type)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Pause a queue
     */
    QueueService.prototype.pauseQueue = function (queueName) {
        return __awaiter(this, void 0, void 0, function () {
            var queue;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        queue = this.bullmq.queue(queueName);
                        return [4 /*yield*/, queue.pause()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Resume a queue
     */
    QueueService.prototype.resumeQueue = function (queueName) {
        return __awaiter(this, void 0, void 0, function () {
            var queue;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        queue = this.bullmq.queue(queueName);
                        return [4 /*yield*/, queue.resume()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return QueueService;
}());
exports.default = QueueService;
