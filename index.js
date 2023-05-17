const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// data for test server
const users = [
    { id: 1, name: "Nagib Mahfuz Fuad", age: 33, married: true },
    { id: 2, name: "Adib Mahmud Ziad", age: 25, married: false },
    { id: 3, name: "Farhana Yeasmin Asha", age: 28, married: true }
]

app.get("/", (req, res) => {
    res.send('Toy marketplace server is running');
});

app.get("/users", (req, res)=>{
    res.send(users);
});

app.listen(port, () => {
    console.log(`server is runnong on port: ${port}`);
});