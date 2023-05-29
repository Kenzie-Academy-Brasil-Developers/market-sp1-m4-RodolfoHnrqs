import express, { Application, json } from "express";
import logic from "./logic";
import middlewares from "./middlewares";

const app: Application = express();
app.use(express.json());

app.post("/products", middlewares.verifyProductExistence, logic.create);

app.get("/products", logic.read);

app.get("/products/:id", middlewares.verifyIdExistence, logic.retrieve);

app.patch("/products/:id", middlewares.verifyIdExistence, middlewares.verifyProductPatch, logic.update);

app.delete("/products/:id", middlewares.verifyIdExistence, logic.destroy);

const PORT: number = 3000;
const runningMsg: string = `Server running on http://localhost:${PORT}`;
app.listen(PORT, () => console.log(runningMsg));