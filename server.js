import express from "express";
import bootstrap from "./src/app.js";
import { connect } from "./src/db/connect.js";
import { UserSeeder } from "./src/seeders/UsersSeeder.js";
import dotenv from "dotenv";
import { MailServer } from "./src/utils/mail.js";
import { RoleSeeder } from "./src/seeders/RoleSeeder.js";
import PermissionSeeder from "./src/seeders/PermissionSeeder.js";
import Role from "./src/models/Role.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 6000;
const app_url = process.env.APP_URL;

await connect();
await bootstrap(app, express);
await MailServer();
//await UserSeeder();
// await RoleSeeder()
// await PermissionSeeder()

app.listen(port, () => {
  console.log(`App is listining on ${app_url}:${port}`);
});
