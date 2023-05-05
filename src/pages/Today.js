import React, { useState, useEffect } from 'react';
import TaskDataService from '../services/TaskService';

import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography'
import NavBar from '../components/NavBar';
import AddTask from '../components/AddTask';
import Task from '../components/Task';

export default function Today() {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        retrieveTasks();
    });

    const refreshTasks = () => {
        retrieveTasks();
    };

    const formatTodayDate = () => {
        var date = new Date();
        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getUTCDate();
    }

    const retrieveTasks = () => {
        var today = formatTodayDate();

        TaskDataService.getDueToday(today)
            .then(res => {
                setTasks(res.data);
            })
            .catch(e => {
                console.log(e);
            });
    };

    const activeTasks = tasks ? tasks.filter(task => {  
        return task.completed === false;
    }) : []

    const taskList = activeTasks.map(task => (
        <div key={task._id}>
            <Task
                id={task._id}
                refreshTasks={refreshTasks}
            />
            <Divider />
        </div>
    ));

    const TaskView = () => {
        if(taskList.length === 0) {
            return <div className={classes.empty}>
                <Typography align="center" variant="h4" color="primary">Add some tasks due today</Typography>
            </div>;
        } else {
            return <List> {taskList} </List>;
        }
    };

    return (
        <div className="container">
            <NavBar title="Today" />
            <AddTask refreshTasks={refreshTasks} />
            <TaskView />
        </div>
    )
}