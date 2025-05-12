import { writeFileSync } from "fs";

const {
	DB_USER,
	DB_PASSWORD,
	DB_HOST,
	DB_PORT,
	DB_NAME,
	NODE_ENV,
} = process.env;

let queryParams = "connection_limit=5";
if (NODE_ENV === "prod") {
	queryParams += "&sslaccept=strict";
}

const DATABASE_URL = `mysql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?${queryParams}`;

writeFileSync(".env.generated", `DATABASE_URL="${DATABASE_URL}"\n`, "utf8");