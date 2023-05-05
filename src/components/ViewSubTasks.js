import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SubTaskDataService from "../services/SubTaskService";

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DialogContentText from '@material-ui/core/DialogContentText';
import Checkbox from '@material-ui/core/Checkbox';

const useStyles = makeStyles({
    headings: {
        marginTop: '10px',
        marginBottom: 0,
    },
});

export default function ViewSubTasks(props) {
    const classes = useStyles();

    const [subTasks, setSubTasks] = useState([]);

    useEffect(() => {
        SubTaskDataService.getAll(props.taskId)
            .then(res => {
                console.log(res.data);
                setSubTasks(res.data);
            })
            .catch(e => {
                console.log(e);
            });
    }, [props.taskId]);

    const subTaskList = subTasks.map(subTask => (
        <ListItem key={subTask._id} role={undefined} dense button>
            <ListItemIcon>
                <Checkbox
                    color="primary"
                    edge="start"
                    checked={subTask.completed}
                    disableRipple
                    onChange={e => handleSubTaskToggle(e, subTask._id)}
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                />
            </ListItemIcon>
            <div>
                <ListItemText id={subTask._id} primary={subTask.title} />
            </div>
        </ListItem>
    ));

    const handleSubTaskToggle = (event, id) => {
        let subTasksArr = [...subTasks];
        let index = subTasksArr.findIndex(elem => elem._id === id);
        subTasksArr[index].completed = event.target.checked;
        let subTask = subTasksArr[index];
        setSubTasks(subTasksArr);

        updateSubTask(id, subTask);
    };

    const updateSubTask = (id, data) => {
        SubTaskDataService.update(id, data)
            .then(res => {
                console.log(res.data);
            })
            .catch(e => {
                console.log(e);
            });
    };

    return (
        <div>
            {subTasks.length === 0 ? (
                <div></div>
            ) : (
                <div>
                    <DialogContentText className={classes.headings}>SUBTASKS</DialogContentText>
                    <List>
                        {subTaskList}
                    </List>
                </div>
            )}
        </div>
    );
}