import { useState, useEffect } from 'react';
import type { task, todoList } from '../App';

import { curList, deletedTasks } from '../App';

import { addTask, editTask, deleteTask, completeTask, undoDeleteTask } from '../App';

import EditTaskForm from './EditTaskForm';
import ScreenOverlay from './ScreenOverlay';
import TaskContent from './TaskContent';
import UndoButton from './UndoButton';
import { moveTask } from '../App';

import { eventBus } from '../App';
import LogoutButton from './LogoutButton';

var curTask : task;
var selectedTaskId : number;


/**
 * @returns {JSX.Element} The entire task side of the page.
 * @description A React component representing the entire task side of the page, consisting of the task content, edit task form, screen overlay, and undo delete button.
 * @exports TaskSide
 */



function TaskSide() {
    const [currentList, setCurrentList] = useState<todoList | null>(curList?{...curList}:null);
    const [, set] = useState<task | null>(null);
    const [isEditing, setEditing] = useState(false);
    document.title = "Task Manager - " + (curList ? curList.name : "No List Selected");

    // Close edit form on Escape key press
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isEditing) {
                setEditing(false);
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isEditing, setEditing]);
    

    // Update currentList when curList changes
    useEffect(() => {
        function setCur() {if (curList) setCurrentList({...curList}); else setCurrentList(null)};
        eventBus.addEventListener("onTasks", setCur);
        return () => { eventBus.removeEventListener("onTasks", setCur) };
    }, []);
    
    return (
        <div className="
            bg-[#CED7DE]
            dark:bg-[#051A2B]
            flex
            flex-row
            justify-center
            overflow-y-auto
            h-screen
            w-screen
        ">
            {
                currentList &&
                <TaskContent
                currentList={currentList}
                addTask={(e) => {addTask(e);}}
                editTask={(task) => {curTask = task; set(task); setEditing(true) }}
                toggleComplete={(id) => {completeTask(id);}}
                deleteTask={(id) => {deleteTask(id);}}
                selectTask={(id) => {selectedTaskId = id;}}
                moveTask={(id) => {curList && moveTask(selectedTaskId, curList.tasks.findIndex(t => t.id === id));}}
                />
            }
            { !currentList &&
                <>
                    <h1 className=' text-7xl p-15 font-black'>No List Selected</h1>
                </>
            }
            <UndoButton undoDeleteTask={() => {undoDeleteTask();}} disabled={deletedTasks.length === 0} />
            <LogoutButton />
            <ScreenOverlay active={isEditing} />


            <EditTaskForm
            task={{...curTask}}
            isEditing = {isEditing}
            onSubmit={(id, newText) => {editTask(id||0, newText||""); console.log("edited task"); setEditing(false);}}
            onblur={() => {setEditing(false)}}
            />
            
        </div>
        );
}

export default TaskSide;