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
var bullmq_1 = require("bullmq");
var BullMQManager = /** @class */ (function () {
    function BullMQManager(config, logger) {
        this.config = config;
        this.logger = logger;
        this.queues = new Map();
        this.workers = new Map();
        this.queueEvents = new Map();
    }
    /**
     * Create or get a queue instance
     */
    BullMQManager.prototype.queue = function (name) {
        if (!this.queues.has(name)) {
            var queue = new bullmq_1.Queue(name, {
                connection: this.config,
                defaultJobOptions: this.config.defaultJobOptions,
            });
            this.queues.set(name, queue);
        }
        return this.queues.get(name);
    };
    /**
     * Create or get a worker instance
     */
    BullMQManager.prototype.worker = function (name, processor, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        if (!this.workers.has(name)) {
            var worker = new bullmq_1.Worker(name, processor, __assign({ connection: this.config }, options));
            // Add error handling
            worker.on('error', function (error) {
                _this.logger.error("Worker ".concat(name, " error: ").concat(error.message));
            });
            worker.on('failed', function (job, error) {
                _this.logger.error("Job ".concat(job === null || job === void 0 ? void 0 : job.id, " failed in queue ").concat(name, ": ").concat(error.message));
            });
            worker.on('completed', function (job) {
                _this.logger.info("Job ".concat(job.id, " completed in queue ").concat(name));
            });
            this.workers.set(name, worker);
        }
        return this.workers.get(name);
    };
    /**
     * Create or get queue events instance
     */
    BullMQManager.prototype.events = function (name) {
        if (!this.queueEvents.has(name)) {
            var queueEvents = new bullmq_1.QueueEvents(name, {
                connection: this.config,
            });
            this.queueEvents.set(name, queueEvents);
        }
        return this.queueEvents.get(name);
    };
    /**
     * Get all queues
     */
    BullMQManager.prototype.getQueues = function () {
        return Array.from(this.queues.values());
    };
    /**
     * Get all workers
     */
    BullMQManager.prototype.getWorkers = function () {
        return Array.from(this.workers.values());
    };
    /**
     * Shutdown all connections
     */
    BullMQManager.prototype.shutdown = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, worker, _b, _c, queueEvents, _d, _e, queue;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _i = 0, _a = this.workers.values();
                        _f.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        worker = _a[_i];
                        return [4 /*yield*/, worker.close()];
                    case 2:
                        _f.sent();
                        _f.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        _b = 0, _c = this.queueEvents.values();
                        _f.label = 5;
                    case 5:
                        if (!(_b < _c.length)) return [3 /*break*/, 8];
                        queueEvents = _c[_b];
                        return [4 /*yield*/, queueEvents.close()];
                    case 6:
                        _f.sent();
                        _f.label = 7;
                    case 7:
                        _b++;
                        return [3 /*break*/, 5];
                    case 8:
                        _d = 0, _e = this.queues.values();
                        _f.label = 9;
                    case 9:
                        if (!(_d < _e.length)) return [3 /*break*/, 12];
                        queue = _e[_d];
                        return [4 /*yield*/, queue.close()];
                    case 10:
                        _f.sent();
                        _f.label = 11;
                    case 11:
                        _d++;
                        return [3 /*break*/, 9];
                    case 12:
                        // Clear maps
                        this.workers.clear();
                        this.queueEvents.clear();
                        this.queues.clear();
                        return [2 /*return*/];
                }
            });
        });
    };
    return BullMQManager;
}());
exports.default = BullMQManager;
