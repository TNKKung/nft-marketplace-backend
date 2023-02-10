const express = require("express");

const nftRoute = require("./nft.route");
const authRoute = require("./auth.route");
const collectionRoute = require("./collection.route");
const userRoute = require("./user.route");
const searchRoute = require("./search.route");

const router = express.Router();

const defaultRoutes = [
  {
    path: "/nft",
    route: nftRoute,
  },
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/collection",
    route: collectionRoute,
  },
  {
    path: "/user",
    route: userRoute,
  },
  {
    path: "/search",
    route: searchRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
