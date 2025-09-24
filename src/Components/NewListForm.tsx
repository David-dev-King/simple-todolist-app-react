import { useState } from 'react';

/**
 * @param {NewListFormProps} props The props for the NewListForm component.
 * @param {function(text: string):void} [props.onSubmit] Callback function to handle the submission of the form.
 * @param {function(text: string):void} [props.onChange] Callback function to handle list filtering when the text in the input field changes.
 * @returns {JSX.Element} A form to create a new to-do list.
 * @description A React component for a form that handles creation of new to-do lists and filtering of displayed lists.
 * @exports NewListForm
 */


interface NewListFormProps {
    onSubmit?: (text: string) => void;
    onChange?: (text: string) => void;
}


function NewListForm({ onSubmit, onChange } : NewListFormProps) {
    const [inputValue, setInputValue] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit(inputValue);
            setInputValue("");
            onChange?.("");
        }
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        if (onChange) onChange(e.target.value);
    };

    return(
        <form id="new-List-form" onSubmit={handleSubmit} className='
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
                placeholder='Enter new list'
                onChange={e => handleChange(e)}
                autoComplete="off"
                id="new-list-input" 
             />
             <span className='w-0.5 h-7 bg-black mr-3 ml-3'></span>
            <button type="submit" className="p-1 pl-5 pr-5 max-md:pl-2.5 max-md:pr-2.5 rounded-xl outline-amber-50 hover:outline-2 hover:bg-amber-100 active:bg-amber-200 active:shadow-[0_0_10px_1px_theme('colors.amber.500')] hover:shadow-[0_0_10px_1px_theme('colors.amber.500')] transition-all duration-200 ease-in-out"><i className='fas fa-plus'></i></button>
        </form>
    );
};

export default NewListForm;