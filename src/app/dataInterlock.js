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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var firebase_1 = require("./firebase");
var firestore_1 = require("firebase/firestore");
var fs_1 = require("fs");
var path_1 = require("path");
function getData() {
    return __awaiter(this, void 0, void 0, function () {
        var fireposts, posts;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, firestore_1.getDocs)((0, firestore_1.collection)(firebase_1.db, "posts"))];
                case 1:
                    fireposts = _a.sent();
                    posts = [];
                    /** firebase 에 있는 data 배열 */
                    fireposts.forEach(function (doc) {
                        posts.push(doc.data());
                    });
                    return [2 /*return*/, posts];
            }
        });
    });
}
function dataInterlock() {
    return __awaiter(this, void 0, void 0, function () {
        var posts, postTitles, existingMd, differTargets;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getData()];
                case 1:
                    posts = _a.sent();
                    postTitles = posts.map(function (el) { return el.title; });
                    existingMd = fs_1.default.readdirSync(path_1.default.join(process.cwd(), "data", "md")).map(function (el) { return el.split(".")[0]; });
                    differTargets = existingMd.filter(function (mdTitle) { return !postTitles.includes(mdTitle); });
                    if (differTargets.length) {
                        differTargets.forEach(function (title, i) { return __awaiter(_this, void 0, void 0, function () {
                            var postData, mdPath, mdFile, splitTitles, restLetter;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        postData = (0, firestore_1.doc)(firebase_1.db, "posts", title);
                                        mdPath = path_1.default.join(process.cwd(), "data", "md", "".concat(title, ".md"));
                                        mdFile = fs_1.default.readFileSync(mdPath);
                                        mdFile = mdFile.toString();
                                        splitTitles = title.split(/(?<=[a-z])(?=[A-Z])/);
                                        restLetter = splitTitles.shift();
                                        return [4 /*yield*/, (0, firestore_1.setDoc)(postData, {
                                                id: posts.length + 1 + i,
                                                title: title,
                                                content: ((_a = mdFile.match(/#+\s(.+)/g)) === null || _a === void 0 ? void 0 : _a[0]) || "",
                                                post_title: "[".concat(restLetter, "] ").concat(__spreadArray([], splitTitles, true).join("")) || "",
                                                heart: {},
                                                heart_count: 0,
                                                created_at: Math.floor(new Date().getTime() / 1000) + i,
                                                tag: __spreadArray([restLetter], splitTitles, true) || [],
                                                comments: [],
                                            })];
                                    case 1:
                                        _b.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        // // 오래된순 => 최신순 => 왠만하면 db업데이트는 사용하지 않는걸로 resource 소모가 너무큼..
                        // posts
                        //   .sort((a, b) => a.created_at - b.created_at)
                        //   .forEach((el, i) => {
                        //     setDoc(doc(db, "posts", el.title), {
                        //       ...el,
                        //       id: i + 1,
                        //     });
                        //   });
                    }
                    return [2 /*return*/];
            }
        });
    });
}
dataInterlock();
