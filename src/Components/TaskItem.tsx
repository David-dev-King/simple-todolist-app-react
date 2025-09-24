import { useEffect, useRef } from 'react';
import type { task } from '../App';

/**
 * @param {TaskItemProps} props The props for the TaskItem component.
 * @param {task} props.task The single task item to be rendered.
 * @param {function(task: task):void} props.editTask Callback function to edit the text of the specified task.
 * @param {function(id: number):void} props.toggleComplete Callback function to toggle the completion of the task with the specified ID.
 * @param {function(id: number):void} props.deleteTask Callback function to delete the task with the specified ID.
 * @param {function(id: number):void} props.selectTask Callback function to handle the selection of the task with the specified ID.
 * @param {function(id: number):void} props.moveTask Callback function to handle moving a task to the index of the task with the specified ID.
 * @returns {JSX.Element} A single, interactive task item with text and action buttons.
 * @description A visual component representing a single task, with actions for editing, deleting, and marking it as complete.
 * @exports TaskItem
 */




type TaskItemProps = {
    task: task;
    editTask: (task: task) => void;
    deleteTask: (id: number) => void;
    toggleComplete: (id: number) => void;
    selectTask: (id: number) => void;
    moveTask: (id: number) => void;
};

function TaskItem({ task, editTask, deleteTask, toggleComplete, selectTask, moveTask }: TaskItemProps) {
    const liRef = useRef<HTMLLIElement>(null);
    const strikeThroughRef = useRef<HTMLSpanElement>(null);

    // Update data attributes based on task completion status
    useEffect(() => {
        const listItem = liRef.current as HTMLLIElement;
        const strikeThrough = strikeThroughRef.current as HTMLSpanElement;
        if (listItem) {
            if (task.completed) {
                listItem.setAttribute('data-completed', 'true');
                strikeThrough.setAttribute('data-completed', 'true');
            } else {
                listItem.setAttribute('data-completed', 'false');
                strikeThrough.setAttribute('data-completed', 'false');
            }
        }
    }, [task.completed, task.id]);

    return (
        <li data-task-id={task.id} ref={liRef} onMouseDown={() => {selectTask(task.id);}} onMouseUp={() => moveTask(task.id)} className="
            select-none
            relative
            flex
            justify-between
            items-center
            border-b
            last:border-b-0
            border-gray-300
            p-2
            hover:cursor-grab
            active:cursor-grabbing
            active:bg-[#E1E8ED]
            active:dark:bg-[#082338]
            rounded-lg
            active:scale-[0.98]
            data-[completed=true]:opacity-50
            transition-all
            duration-200
            ease-in-out
        ">
            <span ref={strikeThroughRef} className="
                strike-through
                absolute
                left-0
                w-full
                origin-left
                scale-x-0
                data-[completed=true]:scale-x-100
                transition-all
                duration-200
                ease-in-out
                h-0.5
                bg-orange-300
            "></span>
            <span className='
                p-2
                pr-6
                break-words
                flex-grow
            '>{task.text}</span>
            <span className="option-btns outline-amber-50 *:outline-amber-50 *:hover:!opacity-100 *:hover:[&_.btn-backdrop]:scale-x-100 *:hover:text-white *:hover:[&_.btn-backdrop]:outline-2 *:active:!opacity-100 *:active:[&_.btn-backdrop]:scale-x-100 *:active:text-white *:active:[&_.btn-backdrop]:outline-2 hover:outline-2 hover:shadow-[0_0_10px_1px_theme('colors.amber.500')] rounded-l-2xl rounded-r-2xl text-[0.85rem] dark:hover:bg-[#082338] transition-all duration-200 ease-in-out hover:*:opacity-30 *:transition-all *:duration-200 *:ease-in-out *:p-2.5 *:pr-[0.4rem] *:pl-[0.4rem] *:rounded-full *:relative flex">
                <button className='edit-btn' onClick={() => editTask(task)}><span className='btn-backdrop absolute inset-0 bg-amber-600 dark:bg-amber-700 rounded-l-2xl transition-all duration-200 ease-in-out scale-x-0 origin-left'></span><i className="fas fa-edit relative"></i></button>
                <button className='delete-btn' onClick={() => deleteTask(task.id)}><span className='btn-backdrop absolute inset-0 bg-amber-600 dark:bg-amber-700 transition-all duration-200 ease-in-out scale-x-0'></span><i className="fas fa-trash relative"></i></button>
                <button className='complete-btn [&_.fa-undo]:!hidden hover:[&_.fa-undo]:!inline hover:[&_.fa-circle-check]:!hidden' onClick={() => toggleComplete(task.id)}><span className="btn-backdrop absolute inset-0 bg-amber-600 dark:bg-amber-700 rounded-r-2xl transition-all duration-200 ease-in-out scale-x-0 origin-right"></span>{task.completed ? <><i className="fa-solid fa-circle-check relative"></i><i className="fas fa-undo relative"></i></> : <i className="fas fa-check relative"></i>}</button>
                </span>
        </li>
    );
}

export default TaskItem;