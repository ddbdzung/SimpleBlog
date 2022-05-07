const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    APP_ENV: Joi.string().valid('production', 'development', 'test').required(),
    APP_PORT: Joi.number().default(1010),
    DB_CONNECTION: Joi.string().required().description('database type'),
    DB_HOST: Joi.string().required().description('database host'),
    DB_PORT: Joi.number().required().default(27017).description('database port'),
    DB_NAME: Joi.string().required().description('database name'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.APP_ENV,
  port: envVars.APP_PORT,
  host: envVars.APP_HOST,
  mongoose: {
    url: envVars.DB_CONNECTION + '://' + envVars.DB_HOST + ':' + envVars.DB_PORT + '/' + envVars.DB_NAME + (envVars.APP_ENV === 'test' ? '-test' : ''),
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
};