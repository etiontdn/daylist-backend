import express, { Application, Request, Response } from "express";
import db from "./database";

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
    res.send("TypeScript with Express Server is running!");
    db.query("SELECT * FROM EMPLOYEE;", (err, rows, fields) => {
        if (err) throw err;
        console.log(rows);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
