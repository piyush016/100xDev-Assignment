const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const shortid = require("shortid");

const PORT = 3000;

const app = express();
app.use(bodyParser.json());
let db;
try {
  db = JSON.parse(fs.readFileSync("./db.json", "utf-8"));
} catch (error) {
  console.error("Error reading data:", error);
}

//For signup(registration) of user
app.post("/signup", (req, res) => {
  const user = req.body;
  const userExist = db.find((person) => person.email == user.email);

  if (userExist) {
    return res.status(400).send({ msg: "Account alredy exists" });
  }

  user.id = shortid.generate();
  db.push(user);
  fs.writeFileSync("./db.json", JSON.stringify(db));
  res.status(201).send({ msg: "Account created", user: user });
});

//For login of user
app.post("/login", (req, res) => {
  let user = db.find(
    (person) =>
      person.email === req.body.email && person.password === req.body.password
  );
  if (!user) {
    return res.status(401).send({ auth: false, message: "Invalid User" });
  } else {
    const token = shortid.generate();
    user.token = token;
    res.send({ auth: true, user: user, token: token });
  }
});

//To get all the users from database
app.get("/data", (req, res) => {
  const { email, password } = req.headers;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  let user = db.find(
    (person) => person.email === email && person.password === password
  );
  if (!user) {
    return res.status(401).send({ auth: false, message: "Unauth access" });
  }

  let usersToReturn = [];
  for (let i = 0; i < db.length; i++) {
    usersToReturn.push({
      firstName: db[i].firstName,
      lastName: db[i].lastName,
      email: db[i].email,
    });
  }
  res.send(usersToReturn);
});

app.all("*", (req, res) => {
  res.status(404).send({ msg: "No page found" });
});

app.listen(PORT, () => {
  console.log("Server is up and running on port " + PORT);
});
