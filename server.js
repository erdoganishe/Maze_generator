const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const mazeRouter = require('./maze');


const router = express.Router();


app.use(express.json());

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "views/index.html"));
});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', router);

app.use('/api', mazeRouter);

app.post('/maze', (req, res) => {
    const { width, height } = req.body;
  
});

app.listen(port, () => {
  console.log(`Maze generator app listening at http://localhost:${port}`);
});