import type { task } from '../App';
import TaskItem from './TaskItem';

/**
 * @param {TaskPanelProps} props The props for the TaskPanel component.
 * @param {task[]} props.tasks The array of tasks to be rendered.
 * @param {function(task: task):void} props.editTask Callback function to edit the text of the specified task.
 * @param {function(id: number):void} props.toggleComplete Callback function to toggle the completion of the task with the specified ID.
 * @param {function(id: number):void} props.deleteTask Callback function to delete the task with the specified ID.
 * @param {function(id: number):void} props.selectTask Callback function to handle the selection of the task with the specified ID.
 * @param {function(newIndex: number):void} props.moveTask Callback function to handle moving of the selected task to the specified index of the array.
 * @returns {JSX.Element} A div element containing a list of tasks.
 * @description A panel containing a list of all tasks of the current to-do list.
 * @exports TaskPanel
 */



interface TaskPanelProps {
    tasks : task[],
    editTask: (task: task) => void;
    deleteTask: (id: number) => void;
    toggleComplete: (id: number) => void;
    selectTask: (id: number) => void;
    moveTask: (newIndex: number) => void;
}

function TaskPanel({tasks, editTask, deleteTask, toggleComplete, selectTask, moveTask} : TaskPanelProps){
    return (
        <div className='
            dark:bg-[#0C2940]
            p-4
            rounded-[30px]
            w-full
            bg-white'>
            <ul>
                {tasks && tasks.map(task => (
                    <TaskItem key={task.id}
                    task={task}
                    deleteTask={deleteTask}
                    toggleComplete={toggleComplete}
                    editTask={editTask}
                    selectTask={selectTask}
                    moveTask={moveTask}
                     />
                ))}
            </ul>
        </div>
    )
}

export default TaskPanel;