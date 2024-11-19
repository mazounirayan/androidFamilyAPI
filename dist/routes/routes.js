"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initRoutes = void 0;
const invalid_path_handler_1 = require("../errors/invalid-path-handler");
const userAuthentication_1 = require("./users/userAuthentication");
const user_1 = require("./users/user");
const initRoutes = (app) => {
    app.get("/health", (req, res) => {
        res.send({ "message": "succes" });
    });
    (0, userAuthentication_1.UserHandlerAuthentication)(app);
    (0, user_1.UserHandler)(app);
    app.use(invalid_path_handler_1.invalidPathHandler);
};
exports.initRoutes = initRoutes;
