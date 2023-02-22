const dotenv = require("dotenv");
const path = require("path");
const joi = require("joi");

dotenv.config({ path: path.join(__dirname, "../../.env") });

const envSchema = joi
  .object()
  .keys({
    PRIVATE_KEY: joi.string().required(),
  })
  .unknown(true);
const { value: env, error } = envSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  port: 4000,
  privateKey: env.PRIVATE_KEY,
  jwtSecretKey: env.JWT_SECRET_KEY,
  moralisApiKey: env.MORALIS_API_KEY,
  marketplaceContract: "0xE810a1Fa602E71548e3E40E0Db0109fF47A9B7D9",
  nftContract: "0x985F253fB2F1b47acAAA6fcdc1D00178f7E7B207",
};
