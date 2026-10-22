import { defineConfig } from "drizzle-kit"

export default defineConfig({
    dialect: "mysql",
    dbCredentials: {
        url: process.env.DATABASE_URL!

        // host: "",
        // database: "",
        // password: "",
        // user: "",
        // ssl: {
        //     rejectUnauthorized: false
        // }
        // sl: {
        //    s rejec
        // }
    }
})