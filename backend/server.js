import express from 'express';
import cors from 'cors';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import dotenv from 'dotenv';

// dotenv.config();

// const PORT = process.env.PORT || 5000

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(cors());

const taskRouter = express.Router();

const port = 5000;

const tasks = [];

// { 'id': 82, 'title': 'coding', 'description': 'done', 'Status': 'pending' },

taskRouter.get('/tasks', (req, res) => {
    const allTasks = tasks;

    try {
        if (!allTasks) return res.status(404).json({ error: "There is no task available in database" })
        
        return res.status(200).json(allTasks)
    }
    catch (error) {
        return res.status(500).json({error: "Something went wrong!"})
    }
})

taskRouter.get('/tasks/:id', (req, res) => {
    const Id = parseInt(req.params.id);

    try {
        if (!Id) return res.status(400).json({ error: "the id parameter is missing in the url" });

        const aTask = tasks.filter(task => task.id === Id);

        if (!aTask) return res.status(404).json({ error: "there is no such task present in the database" });

        return res.status(200).json({ message: { aTask } });
    }
    catch (error) {
        return res.status(500).json({ error: "Something went wrong" });
    }
})

taskRouter.post('/tasks/add', (req, res) => {
    const newTask = req.body;

    console.log('req.body in post',req.body);

    const title = newTask.title;

    try {
        if (!title) return res.status(400).json({ error: "title is required. please enter a title" });

        tasks.push(newTask)

        console.log('post task',tasks);

        return res.status(200).json({message: {"title": newTask.title, "description": newTask.description}})
    }
    catch (error) {
        res.status(500).json({error : "Something went wrong!"})
    }
})

taskRouter.put('/tasks/edit/:id', (req, res) => {
    const Id = parseInt(req.params.id);
    const newTask = req.body;
    console.log('update body', newTask);

    try {
        if (!Id) return res.status(400).json({ error: "the id parameter is missing in the url" });

        const taskIndex = tasks.findIndex(task => task.id === Id); 

        if (!newTask.title) return res.status(400).json({ error: 'Title is required!' })
        if (!newTask.Status) return res.status(400).json({error: 'Status is required!'})
        
        tasks[taskIndex].title = newTask.title;
        tasks[taskIndex].description = newTask.description;
        tasks[taskIndex].Status = newTask.Status;

        return res.status(200).json(tasks);
    }
    catch (error) {
        res.status(500).json({error : "Something went wrong!"})
    }
})

taskRouter.delete('/tasks/delete/:id', (req, res) => {
    const Id = parseInt(req.params.id);
    console.log(Id);

    try {
        if (!Id) return res.status(400).json({ error: "the id parameter is missing in the url" });

        const taskIndex = tasks.findIndex(task => task.id === Id);  // find the index of required element.

        if (taskIndex === -1) return res.status(404).json({ error: "Task not found" });

        tasks.splice(taskIndex, 1); // removes element and upates the original array.

        return res.status(200).json(tasks);
    }
    catch (error) {
        return res.status(500).json({ error: "Something went wrong" });
    }
})

app.use('/api', taskRouter);

// serve static react files

// app.use(express.static(path.join(__dirname, '../client/build')));

// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
// })

app.listen(port, () => {
    console.log('Server is running on', port);
})
