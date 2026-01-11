import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/table.schema.ts",
  dialect: "postgresql",
  casing: "snake_case",
  dbCredentials: {
    // url: "postgres://shop:shop@localhost:5444/shop",

    url: "postgres://user_yDBAhF:password_FXwrTE@139.196.30.42:5432/gina"
  },
});
