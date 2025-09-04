import { useEffect, useState, type FormEvent } from 'react';
import type { todoList } from '../App';

interface EditListFormProps {
    list?: todoList;
    isEditing?: boolean;
    onSubmit?: (id?:number, newName?: string) => void;
    onblur?: () => void;
}


function EditListForm({ list, isEditing, onSubmit, onblur } : EditListFormProps) {
    const [inputValue, setInputValue] = useState(list?.name||"");
    useEffect (() => {setInputValue(list?.name||""); (document.getElementById("edit-list-input") as HTMLInputElement).focus()}, [list, isEditing]);
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit( list?.id ,inputValue? inputValue : "");
        }
        setInputValue("");
    };

    return (
        <form className="
            fixed
            top-1/4
            left-[40vw]
            !translate-x-0
            flex
            items-center
            justify-between
            !opacity-100
            bg-white
            p-4
            rounded-full
            text-gray-800
            mb-8
            w-xl
            z-6
            "
            style={{display : isEditing?'flex': 'none'}}
            id="edit-list-form"
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
                id="edit-list-input"
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

export default EditListForm;