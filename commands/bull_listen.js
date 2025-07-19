"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var ace_1 = require("@adonisjs/core/ace");
var BullListen = /** @class */ (function (_super) {
    __extends(BullListen, _super);
    function BullListen() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BullListen.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var BullMQManager, bullmq, logger, queuesToListen, _loop_1, this_1, _i, queuesToListen_1, queueName;
            var _this = this;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require('../src/bullmq_manager.js'); })];
                    case 1:
                        BullMQManager = (_b.sent()).default;
                        return [4 /*yield*/, this.app.container.make('recordset/bullmq')];
                    case 2:
                        bullmq = _b.sent();
                        return [4 /*yield*/, this.app.container.make('logger')
                            // Determine which queues to listen to
                        ];
                    case 3:
                        logger = _b.sent();
                        queuesToListen = ((_a = this.queues) === null || _a === void 0 ? void 0 : _a.length)
                            ? this.queues
                            : this.queueName
                                ? [this.queueName]
                                : ['default'];
                        logger.info("Starting Bull workers for queues: ".concat(queuesToListen.join(', ')));
                        _loop_1 = function (queueName) {
                            try {
                                var worker = bullmq.worker(queueName, function (job) { return __awaiter(_this, void 0, void 0, function () {
                                    var jobData, jobType, jobModule, JobClass, jobInstance, result, error_1;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                logger.info("Processing job ".concat(job.id, " from queue ").concat(queueName));
                                                jobData = job.data;
                                                jobType = jobData.__jobType || 'unknown';
                                                _a.label = 1;
                                            case 1:
                                                _a.trys.push([1, 4, , 5]);
                                                return [4 /*yield*/, Promise.resolve("".concat("../../../app/jobs/".concat(jobType, ".js"))).then(function (s) { return require(s); })];
                                            case 2:
                                                jobModule = _a.sent();
                                                JobClass = jobModule.default;
                                                if (!JobClass) {
                                                    throw new Error("Job class ".concat(jobType, " not found"));
                                                }
                                                jobInstance = new JobClass();
                                                return [4 /*yield*/, jobInstance.handle({
                                                        data: jobData,
                                                        job: job,
                                                    })];
                                            case 3:
                                                result = _a.sent();
                                                logger.info("Job ".concat(job.id, " completed successfully"));
                                                return [2 /*return*/, result];
                                            case 4:
                                                error_1 = _a.sent();
                                                logger.error("Job ".concat(job.id, " failed: ").concat(error_1.message));
                                                throw error_1;
                                            case 5: return [2 /*return*/];
                                        }
                                    });
                                }); }, {
                                    concurrency: this_1.concurrency,
                                });
                                logger.info("Worker started for queue: ".concat(queueName));
                                // Graceful shutdown
                                process.on('SIGTERM', function () { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                logger.info('Shutting down Bull workers...');
                                                return [4 /*yield*/, bullmq.shutdown()];
                                            case 1:
                                                _a.sent();
                                                process.exit(0);
                                                return [2 /*return*/];
                                        }
                                    });
                                }); });
                                process.on('SIGINT', function () { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                logger.info('Shutting down Bull workers...');
                                                return [4 /*yield*/, bullmq.shutdown()];
                                            case 1:
                                                _a.sent();
                                                process.exit(0);
                                                return [2 /*return*/];
                                        }
                                    });
                                }); });
                            }
                            catch (error) {
                                logger.error("Failed to start worker for queue ".concat(queueName, ": ").concat(error.message));
                            }
                        };
                        this_1 = this;
                        // Start workers for each queue
                        for (_i = 0, queuesToListen_1 = queuesToListen; _i < queuesToListen_1.length; _i++) {
                            queueName = queuesToListen_1[_i];
                            _loop_1(queueName);
                        }
                        // Keep the process running
                        logger.info('Bull workers are running. Press Ctrl+C to stop.');
                        // Prevent the process from exiting
                        return [4 /*yield*/, new Promise(function () { })];
                    case 4:
                        // Prevent the process from exiting
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    BullListen.commandName = 'bull:listen';
    BullListen.description = 'Listen to Bull queues and process jobs';
    BullListen.options = {
        allowUnknownFlags: true,
    };
    return BullListen;
}(ace_1.BaseCommand));
exports.default = BullListen;
