import "dotenv/config";
import express, { json, response } from "express";
import { StorageProvider } from "./storage-provider.js";
// (async () => {     ReferenceError: database is not defined

// })()

//Constants
const database = StorageProvider.getInstance("postgres");
const PORT = process.env.PORT || 5003;
const instance = express();

instance.use(express.json());

//Get all Todos using DB
//Array.from(todoData.values()),

instance.get(`/todos`, async (req, res) => {
  try {
    const { task, description, sort } = req.body;
    const values = await database.getItems(task, description, sort);
    res.json({ value: values });
  } catch (e) {
    res.status(400).json({ error: e.message });
    console.log(e.message);
  }
});

instance.get(`/todos/filter`, async (req, res) => {
  try {
    const { query, sort } = req.body;
    const values = await database.filterItems(query, sort);
    res.json(values);
  } catch (e) {
    res.status(400).json({ error: e.message });
    console.log(e.message);
  }
});

//GET a specific todo by ID
instance.get(`/todos/:id`, async (req, res) => {
  try {
    const { id } = req.params;
    const todoDataList = await database.getItemById(id);

    if (!todoDataList) {
      response.status = 404;
      response.body = {
        succes: false,
        message: "Not found",
      };
      return;
    }
    res.status(200).json(todoDataList);
  } catch (e) {
    console.log(e.message);
    res.status(400).json({ error: e.message });
  }
});

//POST
instance.post(`/todos`, async (req, res) => {
  try {
    const { author, task = "Your task", description } = req.body;
    if (!author || !task)
      return res.json({
        message: "'author' and 'Task' must be provided",
      });

    const result = await database.setItems(author, task, description);

    res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({
      err: err.message,
    });
  }
});

//Update
instance.put("/todos/:id", async (req, res) => {
  try {
    const { author, task, description } = req.body;
    const { id } = req.params;
    if (!id)
      return res.json({
        message: "'ID' must be provided",
      });

    /* const NumId = StorageProvider.getInstance("map") ? Number(id) : id; */
    const item = await database.updateItem(id, req.body);

    res.status(200).json(item);
  } catch (e) {
    res.status(400).json({ error: e.message });
    console.log(e.message);
  }
});

//DELETE
//mongo db returning previuos call in res
instance.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const item = await database.deleteItem(id);
    res.status(200).json(item);
  } catch (e) {
    res.status(400).json({ error: e.message });
    console.log(e.message);
  }
});

//Create Author
instance.post("/author", async (req, res) => {
  const { firstname, lastname } = req.body;
  try {
    const aut = await database.createAuthor(firstname, lastname);
    res.status(200).json(aut);
  } catch (e) {
    res.status(400).json({ error: e.message });
    console.log(e.message);
  }
});

instance.listen(PORT, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log(`Server started on port ${PORT}`);
});

export default database;
