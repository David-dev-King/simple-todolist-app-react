import type { task } from '../App';
import TaskItem from './TaskItem';


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