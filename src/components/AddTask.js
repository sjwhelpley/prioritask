import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TaskDataService from "../services/TaskService";
import './AddTask.css';

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';

const useStyles = makeStyles({
    headings: {
        margin: '10px 0',
    },
    primary: {
        backgroundColor: '#577568',
    },
    primaryColor: {
        color: '#577568',
    },
});

export default function AddTask(props) {
    const classes = useStyles();
    const formatDate = date => {
        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    }

    // Add Task
    const initialTaskState = {
        _id: null,
        title: "",
        dueDate: null,
        description: "",
        completed: false
    };
    const [task, setTask] = useState(initialTaskState);

    // Due Date vars
    var todayDate = new Date();
    var tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    var today = formatDate(todayDate);
    var tomorrow = formatDate(tomorrowDate);

    const [selectedDate, setSelectedDate] = useState(todayDate);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleInputChange = event => {
        const { name, value } = event.target;
        setTask({ ...task, [name]: value });
    }

    const handleToggleButtons = (event, value) => {
        if (event.target.name !== 'custom' && showDatePicker === true) setShowDatePicker(false);

        if (event.target.name === 'custom') {
            setTask({ ...task, dueDate: selectedDate });
        } else {
            setTask({ ...task, dueDate: value });
        }
    }

    const toggleDatePicker = () => {
        setShowDatePicker(!showDatePicker);
    }

    const handleDateChange = (date) => {
        setTask({ ...task, dueDate: date });
        setSelectedDate(date);
    };

    const saveTask = () => {
        var data = {
            title: task.title,
            dueDate: task.dueDate
        };

        TaskDataService.create(data)
            .then(res => {
                setTask(initialTaskState);
                setSelectedDate(todayDate);
                console.log(res.data);
                props.refreshTasks();
                setOpen(false);
            })
            .catch(e => {
                console.log(e);
            });
    };

    // Pop-up
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <div className="fab-container">
                <Fab className={classes.primary} aria-label="add" onClick={handleClickOpen}>
                    <AddIcon />
                </Fab>
            </div>

            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Add Task</DialogTitle>
                <DialogContent>
                    <TextField
                        className={classes.primaryColor}
                        autoFocus
                        margin="dense"
                        id="title"
                        label="Title of task"
                        type="title"
                        fullWidth
                        name="title"
                        value={task.title}
                        onChange={handleInputChange}
                    />
                    {/* <Chip label="Add tag" onClick={handleClick} /> */}
                    <DialogContentText className={classes.headings}>DUE DATE</DialogContentText>

                    <ToggleButtonGroup className={classes.primaryColor} name="dueDate" value={task.dueDate} onChange={handleToggleButtons} exclusive size="small" aria-label="text dueDate">
                        <ToggleButton value={today}>Today</ToggleButton>
                        <ToggleButton value={tomorrow}>Tomorrow</ToggleButton>
                        <ToggleButton onClick={toggleDatePicker} name="custom" value={selectedDate}>Custom</ToggleButton>
                    </ToggleButtonGroup>

                    {showDatePicker ? (
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                format="MM/dd/yyyy"
                                margin="normal"
                                id="date-picker"
                                label="Select Due Date"
                                value={selectedDate}
                                onChange={handleDateChange}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                        </MuiPickersUtilsProvider>
                    ) : null}

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                </Button>
                    <Button onClick={saveTask} color="primary">
                        Save
                </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}