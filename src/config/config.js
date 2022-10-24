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

module.exports = { port: 4000, privateKey: env.PRIVATE_KEY };
