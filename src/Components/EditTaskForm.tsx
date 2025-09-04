import { useEffect, useState, type FormEvent } from 'react';
import type { task } from '../App';

interface EditTaskFormProps {
    task?: task;
    isEditing?: boolean;
    onSubmit?: (id?:number, newText?: string) => void;
    onblur?: () => void;
}


function EditTaskForm({ task, isEditing, onSubmit, onblur } : EditTaskFormProps) {
    const [inputValue, setInputValue] = useState(task?.text||"");
    useEffect (() => {setInputValue(task?.text||""); (document.getElementById("edit-task-input") as HTMLInputElement).focus()}, [task]);
    let taskItem = document.querySelector('[data-task-id = "' + task?.id + '"]');
    let taskTop : string = `${taskItem?.getBoundingClientRect().top?  taskItem?.getBoundingClientRect().top + window.scrollY: 0}px`;
    let taskLeft : string = `${taskItem?.getBoundingClientRect().left? taskItem?.getBoundingClientRect().left + window.scrollX: 0}px`;
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit( task?.id ,inputValue? inputValue : "");
        }
        setInputValue("");
    };

    return (
        <form className="
            fixed
            flex
            items-center
            justify-between
            bg-white
            p-4
            rounded-full
            text-gray-800
            mb-8
            w-xl
            z-6
            "
            style={{display : isEditing?'flex': 'none' , top: taskTop, left: taskLeft}}
            id="edit-task-form"
            onSubmit={handleSubmit}
            onBlur={onblur}
        >
            <input
                className="
                    grow
                    outline-amber-100
                    focus:shadow-[0_0_10px_1px_theme('colors.amber.500')]
                    p-1
                    transition-all
                    duration-200
                    ease-in-out
                    "
                id="edit-task-input"
                type="text"
                placeholder='Enter new description'
                autoComplete='off'
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
            />
            
            <span className='w-0.5 h-7 bg-black mr-3 ml-3'></span>
            <button type="submit" className="p-1 pl-5 pr-5 rounded-xl outline-amber-50 hover:outline-2 hover:bg-amber-100 hover:shadow-[0_0_10px_1px_theme('colors.amber.500')] transition-all duration-200 ease-in-out"><i className='fas fa-check'></i></button>
        </form>
    );
};

export default EditTaskForm;