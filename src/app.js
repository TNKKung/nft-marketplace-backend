const express = require("express");
const cors = require("cors");

const routes = require("./routes");
const { port } = require("./config/config");

const app = express();
app.use(express.json());

app.use(cors());

app.use("/", routes);

app.listen(port, () => {
  console.log(`nft marketplace app listening on port ${port}`);
});
