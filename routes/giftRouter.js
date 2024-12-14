const { Router } = require("express");
const giftController = require("../controllers/giftController");
const giftRouter = Router();

giftRouter.get("/", giftController.giftsGET);

giftRouter.get("/donate", giftController.donateGET);
giftRouter.post(
  "/donate",
  giftController.validateGift,
  giftController.donatePOST
);

giftRouter.get("/about", giftController.aboutGET);

giftRouter.get("/contact", giftController.contactGET);
giftRouter.post(
  "/contact",
  giftController.validateUser,
  giftController.contactPOST
);

module.exports = giftRouter;
