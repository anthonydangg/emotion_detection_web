import path from "path";
import express from "express";
const app = express();
const port = 4000;

// Serve static files from the 'public' directory
app.use(express.static("public"));
//app.use(express.json()); // For parsing application/json

app.get("/", (req, res) => {
    //res.send("Your Node.js backend is running!");
    res.sendFile(path.join(__dirname, "public", "index.html"));
  });

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
