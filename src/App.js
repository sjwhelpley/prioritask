import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import './App.css';

import AllTasks from './pages/AllTasks';
import Today from './pages/Today';
import Upcoming from './pages/Upcoming';

export default function App() {

  const theme = createMuiTheme({
    palette: {
      primary: {
        main: '#577568',
      },
      secondary: {
        main: '#F0F7F7',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Switch className="switch">
        <Route exact path="/" component={Today} />
        <Route path="/upcoming" component={Upcoming} />
        <Route path="/all" component={AllTasks} />
      </Switch>
    </ThemeProvider>
  )
}
