import mongoose, { get, set } from "mongoose";
import "dotenv/config";
import Task from "./task.js";
import Author from "./author.js";
import { Storage } from "./types.js";

const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
//MANGO DB storage
export class MongoStorage extends Storage {
  constructor() {
    super();
    mongoose
      .connect(
        `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.4dojxrf.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`
      )
      .then(() => console.log("DB ok"))
      .catch((err) => console.log("DB error", err));
  }

  async getItems(taskName, description, sort) {
    // for sort = {author: '1'}, for search:   "task": "sleep"
    const searchObj = {};
    if (taskName) {
      searchObj.task = taskName;
    }
    if (description) {
      searchObj.description = description;
    }
    const items = await Task.find(searchObj)
      .populate("author", "Firstname Lastname")
      .sort(sort);

    return items;
  }

  async filterItems(query, sort) {
    // $or: [{"author" : "some"}] like this?
    let filter = {};
    if (query) {
      Object.keys(query).forEach((key) => {
        filter[`$${key}`] = query[key];
      });
    }
    const tasks = await Task.find(filter).sort(sort);
    return tasks;
  }

  async getItemById(id) {
    const item = await Task.findById(id);
    return item;
  }

  async setItems(author, task, description) {
    const idEx = await Author.findById(author);
    if (!idEx) {
      throw new Error("Author with this 'id' doesn't exist.");
    }
    const item = await new Task({
      task,
      description,
      author,
    }).save();
    item.id = item._id; //resave id of created mongodb object

    return item;
  }

  async updateItem(id, { author, task, description }) {
    const item = await Task.findByIdAndUpdate(id, {
      author,
      task,
      description,
    });

    return item;
  }

  async deleteItem(id) {
    const item = await Task.findByIdAndDelete(id);

    return item;
  }

  async createAuthor(firstname, lastname) {
    return await Author.create({
      Firstname: firstname,
      Lastname: lastname,
    });
  }
}
