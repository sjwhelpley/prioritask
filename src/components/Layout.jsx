import React from "react";
import AddTask from "./AddTask";
import NavBar from "./NavBar";

export default function Layout({ title, refreshTasks, children }) {
    return (
        <div>
            <NavBar title={title} />
            <AddTask refreshTasks={refreshTasks} />
            {children}
        </div>
    )
}