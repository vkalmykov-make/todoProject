import "dotenv/config";
import express, { json, response } from "express";
import { StorageProvider } from "./storage-provider.js";
// (async () => {

// })()

//Constants
const database = StorageProvider.getInstance("mongo");
const PORT = process.env.PORT || 5003;
const instance = express();

instance.use(express.json());

//Get all Todos using DB
//Array.from(todoData.values()),

instance.get(`/todos`, async (req, res) => {
  const values = await database.getItems();
  StorageProvider.getInstance("map")
    ? res.json({ value: Array.from(values) })
    : res.json({ value: values });
});

//GET a specific todo by ID
instance.get(`/todos/:id`, async (req, res) => {
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
});

//POST
instance.post(`/todos`, async (req, res) => {
  try {
    const { autor, task = "Your task" } = req.body;
    if (!autor || !task)
      return res.json({
        message: "'Autor' and 'Task' must be provided",
      });

    const result = await database.setItems(autor, task);

    res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({
      message: `Cannot create a Task`,
    });
  }
});

//Update
instance.put("/todos/:id", async (req, res) => {
  const { autor, task } = req.body;
  const { id } = req.params;
  if (!id)
    return res.json({
      message: "'ID' must be provided",
    });

  /* const NumId = StorageProvider.getInstance("map") ? Number(id) : id; */
  const item = await database.updateItem(id, autor, task);

  res.status(200).json(item);
});

//DELETE
//mongo db returning previuos call in res
instance.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const item = await database.deleteItem(id);
  res.status(200).json(item);
});

instance.listen(PORT, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log(`Server started on port ${PORT}`);
});

export default database;
