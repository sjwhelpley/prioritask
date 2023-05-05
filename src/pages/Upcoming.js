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
    empty: {
        marginTop: '25%',
    },
});

export default function Upcoming() {
    const classes = useStyles();
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        retrieveTasks()
    }, []);

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

    const taskList = activeTasks.map(task =>
        <div key={task._id}>
            <Task
                id={task._id}
                refreshTasks={refreshTasks}
            />
            <Divider />
        </div>
    );

    return (
        <Layout title="Upcoming" refreshTasks={refreshTasks}>
            {taskList.length === 0 &&
                <Grid container alignItems="center" justify="center" style={{ height: '100vh' }}>
                    <Typography align="center" variant="h4" color="primary">Add some tasks due soon</Typography>
                </Grid>
            }
            <List>
                {taskList}
            </List>
        </Layout>

    )
}