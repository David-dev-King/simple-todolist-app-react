import type { task, todoList } from "../App";
import NewTaskForm from "./NewTaskForm";
import TaskPanel from "./TaskPanel";



/**
 * @param {TaskContentProps} props The props for the TaskContent component.
 * @param {todoList} props.currentList The to-do list containing the tasks to be rendered.
 * @param {function(text: string):void} props.addTask Callback function to create a new task with the given text.
 * @param {function(task: task):void} props.editTask Callback function to edit the text of the specified task.
 * @param {function(id: number):void} props.toggleComplete Callback function to toggle the completion of the task with the specified ID.
 * @param {function(id: number):void} props.deleteTask Callback function to delete the task with the specified ID.
 * @param {function(id: number):void} props.selectTask Callback function to handle the selection of the task with the specified ID.
 * @param {function(newIndex: number):void} props.moveTask Callback function to handle moving of the selected task to the specified index of the array.
 * @returns {JSX.Element} A container element for the current to-do list title, the new-task form and the task panel.
 * @description A React component housing all the contents of the task side of the document.
 * @exports TaskContent
 */




interface TaskContentProps {
    currentList: todoList;
    addTask: (text: string) => void;
    editTask: (task : task) => void;
    toggleComplete: (id: number) => void;
    deleteTask: (id: number) => void;
    selectTask: (id: number) => void;
    moveTask: (newIndex: number) => void;
}


function TaskContent({ currentList, addTask, editTask, toggleComplete, deleteTask, selectTask, moveTask } : TaskContentProps) {
    return (
        <div className='
            max-w-1/3'>
            <h1 className="text-5xl font-bold mt-10 mb-10">{currentList.name}</h1>
            <NewTaskForm onSubmit={addTask} />
            <TaskPanel tasks={currentList.tasks} editTask={editTask} deleteTask={deleteTask} toggleComplete={toggleComplete} selectTask={selectTask} moveTask={moveTask}/>
        </div>
    );
}
export default TaskContent;