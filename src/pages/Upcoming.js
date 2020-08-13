import React, { useState, useEffect } from 'react';
import TaskDataService from '../services/TaskService';

import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import NavBar from '../components/NavBar';
import AddTask from '../components/AddTask';
import Task from '../components/Task';

export default function Upcoming() {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        let mounted = true;
        var tomorrow = formatTomorrowDate();

        TaskDataService.getDueUpcoming(tomorrow)
            .then(res => {
                if(mounted) {
                    setTasks(res.data);
                }
            })
            .catch(e => {
                console.log(e);
            });
    });

    const refreshTasks = () => {
        retrieveTasks();
    };

    const formatTomorrowDate = () => {
        var date = new Date();
        date.setDate(date.getDate() + 1);
        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
      }

    const retrieveTasks = () => {
        var tomorrow = formatTomorrowDate();

        TaskDataService.getDueUpcoming(tomorrow)
            .then(res => {
                setTasks(res.data);
            })
            .catch(e => {
                console.log(e);
            });
    };

    const activeTasks = tasks.filter(task => {
        return task.completed === false;
    });
    
    const taskList = activeTasks.map(task => (
        <div key={task._id}>
            <Task
                id={task._id}
                refreshTasks={refreshTasks}
            />
            <Divider />
        </div>
      )
    );

    return (
        <div className="container">
            <NavBar title="Upcoming" />
            <AddTask refreshTasks={refreshTasks} />
            <List>
                {taskList}  
            </List>
        </div>
    )
}