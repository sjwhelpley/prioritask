import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TaskDataService from '../services/TaskService';

import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Task from '../components/Task';
import Layout from '../components/Layout';
import { Grid } from '@material-ui/core';

const useStyles = makeStyles({
    headings: {
        margin: '10px 0 0px 15px',
    },
});

export default function AllTasks() {
    const classes = useStyles();
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        retrieveTasks()
    }, []);

    const refreshTasks = () => {
        retrieveTasks();
    };

    const retrieveTasks = () => {
        TaskDataService.getAll()
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

    const uncompletedTaskList = activeTasks.map(task => (
        <div key={task._id}>
            <Divider />
            <Task
                id={task._id}
                refreshTasks={refreshTasks}
            />
            <Divider />
        </div>
    )
    );

    const completedTasks = tasks.filter(task => {
        return task.completed === true;
    });

    const completedTaskList = completedTasks.map(task => (
        <div key={task._id}>
            <Divider />
            <Task
                id={task._id}
                refreshTasks={refreshTasks}
            />
            <Divider />
        </div>
    )
    );

    return (
        <Layout title="All Tasks" refreshTasks={refreshTasks}>
            {tasks.length === 0 ? <Grid container alignItems="center" justify="center" style={{ height: '100vh' }}>
                <Typography>Add some tasks!</Typography></Grid> : <>
                <List>
                    {uncompletedTaskList}
                </List>
                <Typography className={classes.headings} variant="h6" color="primary">Completed Tasks</Typography>
                <List>
                    {completedTaskList}
                </List>
            </>}
        </Layout>
    )
}