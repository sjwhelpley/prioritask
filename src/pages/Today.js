import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TaskDataService from '../services/TaskService';

import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import NavBar from '../components/NavBar';
import AddTask from '../components/AddTask';
import Task from '../components/Task';

const useStyles = makeStyles({
    empty: {
        marginTop: '25%',
    },
});

export default function Today() {
    const classes = useStyles();
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        let mounted = true;
        var today = formatTodayDate();

        TaskDataService.getDueToday(today)
            .then(res => {
                if (mounted) {
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
    ));

    return (
        <div className="container">
            <NavBar title="Today" />
            <AddTask refreshTasks={refreshTasks} />
            { taskList.length === 0 &&
                <div className={classes.empty}>
                    <Typography align="center" variant="h4" color="primary">Add some tasks due today</Typography>
                </div>
            }
            <List>
                {taskList}
            </List>
        </div>
    )
}