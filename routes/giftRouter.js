const { Router } = require("express");
const giftController = require("../controllers/giftController");
const giftRouter = Router();

giftRouter.get("/", giftController.giftsGET);

giftRouter.get("/donate", giftController.donateGET);

giftRouter.get("/about", giftController.aboutGET);

giftRouter.get("/contact", giftController.contactGET);

module.exports = giftRouter;
