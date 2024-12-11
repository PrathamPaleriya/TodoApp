require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');


const uri = process.env.MONGODB_URI

mongoose.connect(uri)
.then(() => console.log("connected to mongoDB"))
.catch((err) => console.error(err))

const taskSchema = new mongoose.Schema({
    task: {
        type: String,
        required: true,
    },
    is_completed: {
        type: Boolean,
        default: false
    } 
});

const Task = mongoose.model("Task", taskSchema);


const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(bodyParser.json());

// ping
app.get('/ping', async (req, res) => {
    try {
        res.status(200).json({ message: "Running perfect" });
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
})


// get tasks
app.get('/tasks', async (req , res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
});

// create task
app.post('/tasks', async (req , res) => {
    const task = new Task(req.body);

    try {
        const newTask = await task.save();
        res.status(200).json(newTask)
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// update task
app.put('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        res.status(200).json(task);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
})

// delete task
app.delete('/tasks/:id', async (req , res) => {
    try {
        const task = await Task.findByIdAndDelete (req.params.id);
        res.status(200).json({message: 'Task deleted', task});
    } catch (err) {
        res.status(400).json({message: err.message});
    }
})

app.listen(port, (req)=> {
    console.log(`Server is running running`);
})

