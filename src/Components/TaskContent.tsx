import type { task, todoList } from "../App";
import NewTaskForm from "./NewTaskForm";
import TaskPanel from "./TaskPanel";


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