import { useEffect, useRef, useState, type FormEvent } from 'react';
import type { task } from '../App';


/**
 * @param {EditTaskFormProps} props The props for the EditTaskForm component.
 * @param {task} [props.task] The task item to be edited.
 * @param {boolean} [props.isEditing] A boolean to toggle the display of the form.
 * @param {function(id: number, newText?: string):void} [props.onSubmit] Callback function to handle the submission of the form.
 * @param {function():void} [props.onblur] Callback function to hide the form.
 * @returns {JSX.Element | null} A form to edit the text of a task or null if not visible.
 * @description A React component that displays a form for editing the text of a task.
 * @exports EditTaskForm
 */

interface EditTaskFormProps {
    task?: task;
    isEditing?: boolean;
    onSubmit?: (id?:number, newText?: string) => void;
    onblur?: () => void;
}

function EditTaskForm({ task, isEditing, onSubmit, onblur } : EditTaskFormProps) {
    const [inputValue, setInputValue] = useState(task?.text||"");
    const taskInputRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    // Close the form if clicked outside of it 
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (formRef.current && !formRef.current.contains(event.target as Node)) {
                if (onblur) onblur();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [formRef, onblur]);


    // Change the text in the input element to the task text and focus on the input element once it appears
    useEffect (() => {setInputValue(task?.text||""); isEditing && (taskInputRef.current as HTMLInputElement).focus()}, [task, isEditing]);

    if (!task || !isEditing) return;


    // Make sure form always appears on top of the task that is being edited
    const taskItem = document.querySelector('[data-task-id = "' + task.id + '"]') as HTMLElement;
    const taskTop : string = `${taskItem.getBoundingClientRect().top?  taskItem?.getBoundingClientRect().top + window.scrollY: 0}px`;
    const taskLeft : string = `${taskItem.getBoundingClientRect().left? taskItem?.getBoundingClientRect().left + window.scrollX: 0}px`;


    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit( task?.id ,inputValue? inputValue : "");
        }
        setInputValue("");
    };

    return (
        <form ref={formRef} className="
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
            max-lg:w-md
            max-sm:w-2/3
            z-6
            "
            style={{top: taskTop, left: taskLeft}}
            id="edit-task-form"
            onSubmit={handleSubmit}
        >
            <input
                ref={taskInputRef}
                className="
                    w-full
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
            <button type="submit" className="p-1 pl-5 pr-5 rounded-xl outline-amber-50 hover:outline-2 hover:bg-amber-100 active:bg-amber-200 active:shadow-[0_0_10px_1px_theme('colors.amber.500')] hover:shadow-[0_0_10px_1px_theme('colors.amber.500')] transition-all duration-200 ease-in-out"><i className='fas fa-check'></i></button>
        </form>
    );
};

export default EditTaskForm;