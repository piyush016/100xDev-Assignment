const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());

let data = JSON.parse(fs.readFileSync("./db.json", "utf8"));

//Maintaing the count of kidneys
let numberOfHealthyKidneys = 0;
let numberOfUnhealthyKidneys = 0;
// Update counts based on initial data
data.kidneys.forEach((kidney) => {
  if (kidney.healthy) numberOfHealthyKidneys++;
  else numberOfUnhealthyKidneys++;
});

//Gets the number of kidney
app.get("/", function (req, res) {
  const kidneys = data.kidneys.length;
  res.json({
    Total: kidneys,
    Healthy: numberOfHealthyKidneys,
    Unhealthy: numberOfUnhealthyKidneys,
  });
});

//Adds a healthy or unhealthy kidney depending on value
app.post("/", function (req, res) {
  const isHealthy = req.body.isHealthy;
  if (data.kidneys.length < 2) {
    data.kidneys.push({
      healthy: isHealthy,
    });
    if (isHealthy) numberOfHealthyKidneys++;
    else numberOfUnhealthyKidneys++;

    fs.writeFileSync("./db.json", JSON.stringify(data));
    res.status(200).json({
      msg: "Kidney added!",
    });
  } else {
    res.status(400).send("Only two kidneys can be added");
  }
});

//Healthyfies all the kidney
app.put("/", function (req, res) {
  data.kidneys.forEach((kidney) => {
    kidney.healthy = true;
  });

  numberOfHealthyKidneys = 2;
  numberOfUnhealthyKidneys = 0;

  fs.writeFileSync("./db.json", JSON.stringify(data));

  res.status(200).json({
    msg: "All kidney are now healthy!",
    kidneys: data.kidneys,
  });
});

//Removes all the unhealthy kidney
app.delete("/", function (req, res) {
  if (numberOfHealthyKidneys == 2) {
    data.kidneys.pop();
    numberOfHealthyKidneys--;
  } else if (numberOfUnhealthyKidneys == 2 || numberOfUnhealthyKidneys == 1) {
    data.kidneys.pop();
    numberOfUnhealthyKidneys--;
  } else if (numberOfHealthyKidneys == 1 && numberOfUnhealthyKidneys == 1) {
    data.kidneys = data.kidneys.filter((kidney) => kidney.healthy);
    numberOfUnhealthyKidneys = 0;
  } else {
    res.status(400).send("Insufficient kidneys to remove.");
    return;
  }

  fs.writeFileSync("./db.json", JSON.stringify(data));
  res.status(200).json({
    msg: "Kidney removal successfull!",
    kidney: data.kidneys,
  });
});

app.listen(3000);
