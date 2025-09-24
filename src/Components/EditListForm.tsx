import { useEffect, useRef, useState, type FormEvent } from 'react';
import type { todoList } from '../App';


/**
 * @param {EditListFormProps} props The props for the EditListForm component.
 * @param {todoList} [props.list] The to-do list item to be edited.
 * @param {boolean} [props.isEditing] A boolean to toggle the display of the form.
 * @param {function(id?: number, newName?: string):void} [props.onSubmit] Callback function to handle the submission of the form.
 * @param {function():void} [props.onblur] Callback function to hide the form.
 * @returns {JSX.Element | null} A form to edit the name of a to-do list or null if not visible.
 * @description A React component that displays a form for editing the name of a to-do list.
 * @exports EditListForm
 */

interface EditListFormProps {
    list?: todoList;
    isEditing?: boolean;
    onSubmit?: (id?:number, newName?: string) => void;
    onblur?: () => void;
}

function EditListForm({ list, isEditing, onSubmit, onblur } : EditListFormProps) {
    const [inputValue, setInputValue] = useState(list?.name||"");
    const listInputRef = useRef<HTMLInputElement>(null);
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

    // Change the text in the input element to the list name and focus on the input element once it appears
    useEffect (() => {setInputValue(list?.name||""); isEditing && (listInputRef.current as HTMLInputElement).focus();}, [list, isEditing]);


    if (!list || !isEditing) return;
    
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit( list.id ,inputValue? inputValue : "");
        }
        setInputValue("");
    };


    return (
        <div className='fixed h-screen w-screen flex justify-center items-center'>
            <form ref={formRef} className="
                absolute
                top-1/3
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
                max-lg:w-md
                max-sm:w-xs
                z-6
                "
                id="edit-list-form"
                onSubmit={handleSubmit}
            >
                <input
                    ref={listInputRef}
                    className="
                        w-full
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
                <button type="submit" className="p-1 pl-5 pr-5 rounded-xl outline-amber-50 hover:outline-2 hover:bg-amber-100  active:bg-amber-200 active:shadow-[0_0_10px_1px_theme('colors.amber.500')] hover:shadow-[0_0_10px_1px_theme('colors.amber.500')] transition-all duration-200 ease-in-out"><i className='fas fa-check'></i></button>
            </form>
        </div>
    );
};

export default EditListForm;