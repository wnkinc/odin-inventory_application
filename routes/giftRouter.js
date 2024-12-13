const { Router } = require("express");
const giftController = require("../controllers/giftController");
const giftRouter = Router();

giftRouter.get("/", giftController.giftsGET);

module.exports = giftRouter;
