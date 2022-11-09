import "dotenv/config";
import { createRanNum } from "./randomNumber.js";
//const express = require("express");
import express, { response } from "express";
//require("dotenv").config();
//ass

const PORT = process.env.PORT || 5003;

const instance = express();

const todoData = new Map([
  ["1", { name: "jhello ", autor: "some", id: "1", task: "DoImportantThing" }],
  [2, { name: "asd2 ", autor: "some2", id: "2", task: "SomeTask" }],
]);
//s
instance.use(express.json());

/* instance.get("/", (req, res) => {
  res.send(`Hello ${PORT}`);
}); */

instance.get("/todos", (req, res) => {
  res.status(200).json({
    items: Array.from(todoData.values()),
  });
});

instance.get(`/todos/:id`, (req, res) => {
  const { id } = req.params;
  const todoDataList = todoData.get(id);

  if (!todoData) {
    response.status = 404;
    response.body = {
      succes: false,
      message: "Not found",
    };
    return;
  }
 
  res.send(todoDataList);
});

//POST
instance.post(`/todos`, (req, res) => {
  let { autor, task } = req.body; //doesnt work with 'body' parameter
  //let {task}= req.body;
  let randomId = createRanNum().toString();

  let obj = { autor: autor, id: randomId, task: task };
  todoData.set(randomId, obj);
  const todoDataList = todoData.get(randomId);
  res.send(todoDataList);
});

//Update
instance.put("/todos/:id", (req, res) => {
  const { autor, task } = req.body;
  const { id } = req.params;
  todoData.set(id, { autor: autor, task: task, id: id });
  res.send(todoData.get(id));
});

//DELETE
instance.delete("/todos/:id", (req, res) => {
  let { id } = req.params;
  todoData.delete(id);
  res.send(todoData.has(id));
});

instance.listen(PORT, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log(`Server started on port ${PORT}`);
});
