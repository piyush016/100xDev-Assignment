const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
app.use(bodyParser.json());

let data;
try {
  data = JSON.parse(fs.readFileSync("./data.json", "utf-8"));
} catch (error) {
  console.error("Error reading data:", error);
}

//Gets all the todos
app.get("/todos", function (req, res) {
  if (data) {
    res.status(201).json({
      data,
    });
  } else {
    res.status(500).json({
      msg: "Failed to retrieve the data.",
    });
  }
});

//Gets a single todo
app.get("/todos/:id", function (req, res) {
  const todoId = req.params.id;
  const todo = data.find((todo) => todo.id == todoId);

  if (!todo) {
    res.status(401).json({
      msg: "No todo found!",
    });
  } else {
    res.status(200).json({
      todo: todo,
    });
  }
});

//Posts a todo
app.post("/todos", function (req, res) {
  if (
    req.body.title &&
    (req.body.completed == true || req.body.completed == false)
  ) {
    const newTodo = req.body;
    newTodo.id = Math.floor(Date.now() / 1000);
    data.push(newTodo);
    fs.writeFileSync("./data.json", JSON.stringify(data));
    res.status(200).json({
      msg: "New todo added.",
      item: newTodo,
    });
  } else {
    res.status(500).json({
      msg: "Failed to add the task.",
    });
  }
});

//Edit a todo
app.put("/todos/:id", function (req, res) {
  const todoId = req.params.id;
  const todo = data.find((todo) => todo.id == todoId);

  if (!todo) {
    return res.status(404).json({
      msg: "Todo not found.",
    });
  }
  if (!req.body.title && !req.body.completed) {
    return res.status(400).json({
      msg: "No update data provided.",
    });
  }
  if (req.body.title) {
    todo.title = req.body.title;
  }
  if (req.body.completed !== undefined) {
    todo.completed = req.body.completed;
  }
  fs.writeFileSync("./data.json", JSON.stringify(data));
  res.status(200).json({
    todo: todo,
  });
});

//Delete todo
app.delete("/todos/:id", function (req, res) {
  const todoId = req.params.id;
  const todoIndex = data.findIndex((todo) => todo.id == todoId);
  if (!todoIndex === -1) {
    return res.status(404).json({
      msg: "Todo not found.",
    });
  }
  data.splice(todoIndex, 1);
  fs.writeFileSync("./data.json", JSON.stringify(data));
  res.status(200).json({
    msg: "Todo deleted successfully.",
  });
});

//Deletes all the todos
app.delete("/todos", function (req, res) {
  data = [];
  fs.writeFileSync("./data.json", JSON.stringify(data));
  res.status(200).json({
    msg: "Todos deleted successfully.",
  });
});

app.listen(3000);
