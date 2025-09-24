import { useState } from 'react';


/**
 * @param {NewTaskFormProps} props The props for the NewTaskForm component.
 * @param {function(text: string):void} [props.onSubmit] Callback function to handle the submission of the form.
 * @returns {JSX.Element} A form to create a new task.
 * @description A React component for a form that handles creation of new tasks.
 * @exports NewTaskForm
 */


interface NewTaskFormProps {
    onSubmit?: (text: string) => void;
}


function NewTaskForm({ onSubmit } : NewTaskFormProps) {
    const [inputValue, setInputValue] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit(inputValue);
            setInputValue("");
        }
    };

    return(
        <form id="new-task-form" onSubmit={handleSubmit} className='
            flex
            items-center
            justify-between
            bg-white
            p-4
            rounded-full
            text-gray-800
            mb-8
            w-full'>
            <input 
                className="
                    w-full
                    outline-amber-100
                    focus:shadow-[0_0_10px_1px_theme('colors.amber.500')]
                    p-1
                    transition-all
                    duration-200
                    ease-in-out
                    "
                type="text"
                value ={inputValue}
                placeholder='Enter new task'
                autoComplete='off'
                onChange={e => setInputValue(e.target.value)}
                id="new-task-input" 
             />
             <span className='w-0.5 h-7 bg-black mr-3 ml-3'></span>
            <button type="submit" className="p-1 pl-5 pr-5 rounded-xl outline-amber-50 hover:outline-2 hover:bg-amber-100 active:bg-amber-200 active:shadow-[0_0_10px_1px_theme('colors.amber.500')] hover:shadow-[0_0_10px_1px_theme('colors.amber.500')] transition-all duration-200 ease-in-out"><i className='fas fa-plus'></i></button>
        </form>
    );
};

export default NewTaskForm;