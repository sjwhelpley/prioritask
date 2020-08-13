import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TaskDataService from "../services/TaskService";
import './Task.css';

import ViewSubTasks from "./ViewSubTasks";
import AddSubTasks from "./AddSubTasks";

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Chip from '@material-ui/core/Chip';
import IconButton from '@material-ui/core/IconButton';
import MoreIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';

const useStyles = makeStyles({
    menuIcon: {
        float: "right",
        padding: 0,
    },
    headings: {
        marginTop: '10px',
        marginBottom: 0,
    },
    descriptionField: {
        marginTop: '20px',
    },
});

export default function Task(props) {
    const classes = useStyles();
    const formatDate = date => {
        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getUTCDate();
    }

    // Task properties
    const initialTaskState = {
        _id: null,
        title: "",
        dueDate: "",
        description: "",
        completed: false
    };

    const [task, setTask] = useState(initialTaskState);
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        TaskDataService.get(props.id)
            .then(res => {
                var dueDate;
                if (res.data.dueDate === null) {
                    dueDate = null;
                } else {
                    dueDate = formatDate(new Date(res.data.dueDate));
                }
                setTask({
                    _id: res.data._id,
                    title: res.data.title,
                    dueDate: dueDate,
                    description: res.data.description,
                    completed: res.data.completed
                });
                setChecked(res.data.completed);
            })
            .catch(e => {
                console.log(e);
            });
    }, [props.id]);

    const handleToggle = (e) => {
        setChecked(e.target.checked);
        updateCompleted(e.target.checked);
    };

    // Popup states
    const [viewOpen, setViewOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);

    // View Task
    const viewTask = () => {
        setViewOpen(true);
    }

    const handleViewClose = () => {
        setViewOpen(false);
    };

    // Due Date vars
    var todayDate = new Date();
    var tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    var dayAfterTomorrowDate = new Date();
    dayAfterTomorrowDate.setDate(tomorrowDate.getDate() + 1);
    var today = formatDate(todayDate);
    var tomorrow = formatDate(tomorrowDate);

    // Calculate Due Date Labels
    const DueDateChip = () => {
        if (task.dueDate === null) {
            return <div></div>;
        } else if (task.dueDate === today) {
            return <Chip label="Today" variant="outlined" style={{ color: '#ED6A5A', borderColor: '#ED6A5A' }} />;
        } else if (task.dueDate === tomorrow) {
            return <Chip label="Tomorrow" variant="outlined" style={{ color: '#7D1538', borderColor: '#7D1538' }} />;
        } else {
            return <Chip label={task.dueDate} variant="outlined" style={{ color: '#084C61', borderColor: '#084C61' }} />;
        }
    }

    const DueDate = () => {
        if (task.dueDate === undefined || task.dueDate === null) {
            return <div></div>;
        } else {
            return (
                <div>
                    <DialogContentText className={classes.headings}>DUE DATE</DialogContentText>
                    <p>{task.dueDate}</p>
                </div>
            );
        }
    }

    const Description = () => {
        if (task.description === undefined || task.description.length === 0) {
            return <div></div>;
        } else {
            return (
                <div>
                    <DialogContentText className={classes.headings}>DESCRIPTION</DialogContentText>
                    <p>{task.description}</p>
                </div>
            );
        }
    }

    // Menu
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleEdit = () => {
        setEditOpen(true);
        handleMenuClose();
        handleViewClose();
    }

    const handleDelete = () => {
        TaskDataService.remove(task._id)
            .then(res => {
                console.log(res.data);
                props.refreshTasks();
            })
            .catch(e => {
                console.log(e);
            });
        handleMenuClose();
        handleViewClose();
    };

    // Edit Task
    const [selectedDate, setSelectedDate] = useState(dayAfterTomorrowDate);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleInputChange = event => {
        const { name, value } = event.target;
        setTask({ ...task, [name]: value });
    }

    const handleToggleButtons = (event, value) => {
        if (event.target.name !== 'custom' && showDatePicker === true) setShowDatePicker(false);

        if (typeof value !== "string") {
            var newDate = formatDate(selectedDate);
            setTask({ ...task, dueDate: newDate });
        } else {
            setTask({ ...task, dueDate: value });
        }
    }

    const toggleDatePicker = () => {
        setShowDatePicker(!showDatePicker);
    }

    const handleDateChange = (date) => {
        var newDate = formatDate(date);
        setTask({ ...task, dueDate: newDate });
        setSelectedDate(date);
    };

    const updateCompleted = status => {
        var data = {
            _id: task._id,
            title: task.title,
            dueDate: task.dueDate,
            description: task.description,
            completed: status
        };

        TaskDataService.update(task._id, data)
            .then(res => {
                setTask({ ...task, completed: status });
                console.log(res.data);
            })
            .catch(e => {
                console.log(e);
            });
    };

    const updateTask = () => {
        var updatedDate = new Date(task.dueDate);
        var data = {
            title: task.title,
            dueDate: updatedDate,
            description: task.description,
            completed: task.completed
        };

        TaskDataService.update(task._id, data)
            .then(res => {
                console.log(res.data);
            })
            .catch(e => {
                console.log(e);
            });
        setShowDatePicker(false);
        handleEditClose();
        viewTask();
    };

    const handleEditClose = () => {
        setEditOpen(false);
    }

    return (
        <div>
            {/* Task item */}
            <ListItem key={props.id} role={undefined} dense button>
                <ListItemIcon>
                    <Checkbox
                        color="primary"
                        edge="start"
                        checked={checked}
                        disableRipple
                        onChange={handleToggle}
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                    />
                </ListItemIcon>
                <div className="task-click-space" onClick={viewTask}>
                    <ListItemText id={task._id} primary={task.title} />
                </div>
                <DueDateChip />
            </ListItem>

            {/* VIEW TASK */}
            <Dialog fullWidth={true} open={viewOpen} onClose={handleViewClose} aria-labelledby="form-dialog-title">
                <div className="inline">
                    <DialogTitle id="form-dialog-title">
                        View Task
                        <IconButton className={classes.menuIcon} aria-label="display more actions" color="inherit" aria-controls="simple-menu" aria-haspopup="true" onClick={handleMenuClick}>
                            <MoreIcon />
                        </IconButton>
                    </DialogTitle>
                </div>

                <DialogContent>
                    <h1>{task.title}</h1>

                    <DueDate />
                    <ViewSubTasks taskId={props.id} />
                    <Description />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleViewClose} color="primary">
                        Done
                    </Button>
                </DialogActions>
            </Dialog>

            <Menu
                style={{ zIndex: 1400 }}
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleEdit}>Edit</MenuItem>
                <MenuItem onClick={handleDelete}>Delete</MenuItem>
            </Menu>

            {/* EDIT TASK */}
            <Dialog open={editOpen} onClose={handleEditClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Edit Task</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        id="title"
                        label="Title of task"
                        type="title"
                        fullWidth
                        value={task.title}
                        variant="outlined"
                        name="title"
                        onChange={handleInputChange}
                    />
                    <DialogContentText className={classes.headings}>DUE DATE</DialogContentText>

                    <ToggleButtonGroup className={classes.primaryColor} name="dueDate" value={task.dueDate} onChange={handleToggleButtons} exclusive size="small" aria-label="text dueDate">
                        <ToggleButton name="today" value={today}>Today</ToggleButton>
                        <ToggleButton name="tomorrow" value={tomorrow}>Tomorrow</ToggleButton>
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

                    <AddSubTasks taskId={props.id} />

                    <TextField
                        className={classes.descriptionField}
                        margin="dense"
                        id="description"
                        type="description"
                        label="Description"
                        fullWidth
                        variant="outlined"
                        name="description"
                        onChange={handleInputChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={updateTask} color="primary">
                        Update
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}