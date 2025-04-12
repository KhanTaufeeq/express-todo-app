import "./index.css";
import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskStatus, setTaskStatus] = useState("pending");
  const [isEdit, setIsEdit] = useState(false);
  const [editingTask, setEditingTask] = useState(null);


  const fetchTask = () => {
    axios
      .get("http://localhost:5000/api/tasks")
      .then((res) => {
        setTasks(res.data);
        console.log("all tasks", res.data);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    fetchTask();
  }, []);

  const addTask = () => {
    axios
      .post("http://localhost:5000/api/tasks/add", {
        id: tasks.length === 0 ? 1 : tasks[tasks.length - 1].id + 1,
        title: taskTitle,
        description: taskDescription,
        // Status: taskStatus,
      })
      .then((res) => {
        setTaskTitle("");
        setTaskDescription("");
        // setTaskStatus("");
        fetchTask();
        console.log(res.data);
      })
      .catch((error) => console.log(error));
  };

  const toggleEdit = (task) => {
    setIsEdit(true);
    setEditingTask(task);
  };

  const cancelEdit = () => {
    setIsEdit(false);
  };

  const updateTask = (editingTask) => {
    axios
      .put(`http://localhost:5000/api/tasks/edit/${editingTask.id}`, {
        title: editingTask.title,
        description: editingTask.description,
        Status: editingTask.Status,
      })
      .then((res) => {
        setEditingTask(null);
        setIsEdit(false);
        setTasks(res.data);
        console.log(res.data);
      })
      .catch((error) => console.log(error));
  };

  const deleteTask = (id) => {
    axios
      .delete(`http://localhost:5000/api/tasks/delete/${id}`)
      .then((res) => {
        setTasks(res.data);
        console.log("delete response", res.data);
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="flex items-center justify-around h-screen flex-col font-sans w-1/2 mx-auto border-2 border-white rounded-[10px]">
      <h1 className="text-5xl text-violet-300 font-extrabold">What todo app...</h1>
      <div className="flex gap-4 justify-center flex-col">
        <input
          type="text"
          onChange={(event) => setTaskTitle(event.target.value)}
          placeholder="Enter title here..."
          required
          className="bg-gray-200 focus:bg-white p-2 rounded border border-gray-400 outline-none"
        />
        <input
          type="text"
          onChange={(event) => setTaskDescription(event.target.value)}
          placeholder="Enter description here..."
          className="bg-gray-200 focus:bg-white p-2 rounded border border-gray-400 outline-none"
        />
        {/* <select
          onChange={(e) => setTaskStatus(e.target.value)}
          required
          className="bg-gray-200 focus:bg-white p-2 rounded border border-gray-400 outline-none"
        >
          {" "}
          <option value="status">Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select> */}

        <button
          onClick={addTask}
          className="bg-[#0070DF] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
        >
          Add Task
        </button>
      </div>

      <div>
        {tasks.length ? (
          tasks.map((task) => {
            return (
              <div className="mb-5" key={task.id}>
                <div className="flex items-center justify-between w-sm">
                  <div>
                    <p className="text-white text-3xl">{task.title}</p>
                    <p className="text-white">{task.description}</p>
                  </div>
                  <p className="text-white text-xl">{task.Status}</p>
                </div>
                <div className="flex items-center justify-between w-3xs mt-3">
                  <button onClick={() => toggleEdit(task)} className="bg-[#0070DF] hover:bg-blue-700 text-white font-bold py-1 px-4 rounded cursor-pointer">Edit Task</button>
                  {isEdit && (
                    <div className="fixed inset-0 bg-black bg-opacity-5 backdrop-blur-sm flex items-center justify-center">
                      <div>
                        <input
                          type="text"
                          onChange={(event) =>
                            setEditingTask({
                              ...editingTask,
                              title: event.target.value,
                            })
                          }
                          value={editingTask.title}
                          className="bg-gray-200 focus:bg-white p-2 rounded border border-gray-400 outline-none"
                        />
                        <input
                          type="text"
                          onChange={(event) =>
                            setEditingTask({
                              ...editingTask,
                              description: event.target.value,
                            })
                          }
                          value={editingTask.description}
                          className="bg-gray-200 focus:bg-white p-2 rounded border border-gray-400 outline-none"
                          required
                        />
                        <input
                          type="input"
                          onChange={(event) =>
                            setEditingTask({
                              ...editingTask,
                              Status: event.target.value,
                            })
                          }
                          value={editingTask.Status}
                          className="bg-gray-200 focus:bg-white p-2 rounded border border-gray-400 outline-none"
                          required
                        />
                      </div>
                      <div>
                        <button
                          type="submit"
                          onClick={() => updateTask(editingTask)}
                          className="bg-[#0070DF] hover:bg-blue-700 text-white font-bold py-1 px-4 rounded cursor-pointer"
                        >
                          Update
                        </button>
                        <button type="button" onClick={() => cancelEdit()} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded cursor-pointer">
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                  <button onClick={() => deleteTask(task.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded cursor-pointer">
                    Delete Task
                  </button>
                </div>
                <hr className="border-gray-800 md:border-white mt-2"/>
              </div>
            );
          })
        ) : (
          <p className="text-2xl text-white">There is no task yet :(</p>
        )}
      </div>
    </div>
  );
}

export default App;
