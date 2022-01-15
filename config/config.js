require("dotenv").config();
const bcrypt = require("bcryptjs");
const os = require("os");

exports.generateDefaultPassword = async function () {
  const password = await bcrypt.hash(process.env.DEFAULT_PASSWORD, 10);
  return password;
};

const config = (exports.config = {
  port: process.env.PORT || 9999,
  dbUri:
    process.env.DB_URI || `mongodb://localhost:27017/${process.env.DB_NAME}`,
  env: process.env.ENV || "dev",
  solanaApi: process.env.SOLANA_RPC_API,
  cloudflare_token: process.env.CLOUDFLARE_TOKEN,
  tempDir: os.tmpdir(),
  default_email: process.env.DEFAULT_EMAIL,
  meta_name: process.env.META_NAME
});

const mongoOptions = (exports.mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const testNftAddresses = (exports.testNftAddresses = [
  "MU3XRrwbVT8R35s6XVnh3mNQbFSvuFWLSyAUMeJgpka",
  "8GxWA9ronhhdCzggRH74CxTnFJrzN5yXKcMmxbUg6oWZ",
  "FdqAEiti21hP6ymSg2KcAqEDG7qmwcTH8RToKQvENTGF"
]);

const nftAddresses = (exports.nftAddresses = []);