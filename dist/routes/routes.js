"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initRoutes = void 0;
const invalid_path_handler_1 = require("../errors/invalid-path-handler");
const userAuthentication_1 = require("./users/userAuthentication");
const user_1 = require("./users/user");
const famille_1 = require("./famille");
const tache_1 = require("./tache");
const message_1 = require("./message");
const chat_1 = require("./chat");
const recompense_1 = require("./recompense");
const notification_1 = require("./notification");
const initRoutes = (app) => {
    app.get("/health", (req, res) => {
        res.send({ "message": "succes" });
    });
    (0, userAuthentication_1.UserHandlerAuthentication)(app);
    (0, user_1.UserHandler)(app);
    (0, famille_1.FamilleHandler)(app);
    (0, tache_1.TacheHandler)(app);
    (0, message_1.MessageHandler)(app);
    (0, chat_1.ChatHandler)(app);
    (0, recompense_1.RecompenseHandler)(app);
    (0, notification_1.NotificationHandler)(app);
    app.use(invalid_path_handler_1.invalidPathHandler);
};
exports.initRoutes = initRoutes;
