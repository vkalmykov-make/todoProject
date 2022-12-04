import { createRanNum } from "./randomNumber.js";
import mongoose from "mongoose";
import Task from "./task.js";
import "dotenv/config";

const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

export class StorageProvider {
  static getInstance(type) {
    switch (type) {
      case "map":
        return new MapStorage();
      case "mongo":
        return new MongoStorage();
      default:
        throw new Error("unknown type");
    }
  }
}

class Storage {
  getItems() {
    throw new Error("Not implemented");
  }

  setItems() {
    throw new Error("Not implemented");
  }

  getItemById(id) {
    throw new Error("Not implemented");
  }

  isEmpty(value) {
    return Boolean(value);
  }
}

//MAP storage
class MapStorage extends Storage {
  constructor() {
    super();
    this.instance = new Map([
      [
        "1",
        { name: "jhello ", autor: "some", id: "1", task: "DoImportantThing" },
      ],
      ["2", { name: "asd2 ", autor: "some2", id: "2", task: "SomeTask" }],
    ]);
  }

  getItems() {
    const values = this.instance.values();
    return values;
  }

  getItemById(id) {
    const item = this.instance.get(id);
    return item;
  }

  setItems(autor, task) {
    const id = createRanNum().toString();
    //const taskName = task || 'default'
    this.instance.set(id, { autor, task, _id: id });
    return this.instance.get(id);
  }

  updateItem(id, autor, task) {
    this.instance.set(id, { autor, task }); // ... rest operator for saving 'id' inside data

    return this.instance.get(id);
  }

  deleteItem(id) {
    const item = this.instance.delete(id);

    return { success: `${item}` };
  }
}
//MANGO DB storage
class MongoStorage extends Storage {
  constructor() {
    super();
    mongoose
      .connect(
        `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.4dojxrf.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`
      )
      .then(() => console.log("DB ok"))
      .catch((err) => console.log("DB error", err));
  }

  async getItems() {
    const items = await Task.find();
    return items;
  }

  async getItemById(id) {
    const item = await Task.findById(id);
    return item;
  }

  async setItems(autor, task) {
    const item = await new Task({
      autor,
      task,
    }).save();
    return item;
  }

  async updateItem(id, autor, task) {
    const item = await Task.findByIdAndUpdate(id, {
      autor,
      task,
    });

    return item;
  }

  async deleteItem(id){
    const item = await Task.findByIdAndDelete(id)

    return item
  }
}
