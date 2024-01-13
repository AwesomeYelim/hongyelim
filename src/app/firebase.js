"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.firebaseConfig = void 0;
var app_1 = require("firebase/app");
var firestore_1 = require("firebase/firestore");
exports.firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
    projectId: "hongyelim-6311d",
    storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
};
// Initialize Firebase
var app = (0, app_1.initializeApp)(exports.firebaseConfig);
// const analytics = getAnalytics(app);
exports.db = (0, firestore_1.getFirestore)(app);
