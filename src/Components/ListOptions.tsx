import type { todoList } from "../App";
import { useEffect, useRef } from "react";

/**
 * @param {ListOptionsProps} props The props for the ListOptions component.
 * @param {todoList | null} [props.list] The to-do list whose options are currently being displayed.
 * @param {boolean} props.isOption A boolean to toggle the visibility of the options panel.
 * @param {function():void} props.disable Callback function to hide or diable the options panel.
 * @param {function(id: number):void} [props.onPin] Callback function to pin the to-do list with the specified ID.
 * @param {function(id: number):void} [props.onEdit] Callback function to edit the to-do list with the specified ID.
 * @param {function(id: number):void} [props.onDelete] Callback function to delete the to-do list with the specified ID.
 * @returns {JSX.Element} A component that displays the options for a to-do list.
 * @description A component that renders the options (pin, edit, and delete) for a specific to-do list.
 * @exports ListOptions
 */




interface ListOptionsProps {
    list? : todoList | null;
    isOption: boolean;
    disable : () => void;
    onPin? : (id : number) => void;
    onEdit?: (id : number) => void;
    onDelete?: (id : number) => void;
}

function ListOptions({ list, isOption, disable, onPin, onEdit, onDelete } : ListOptionsProps ) {
    const listOptionsRef = useRef<HTMLUListElement>(null);

    // Disable the options if we click outside of it
    useEffect(() => {
        function onMouseDown(e: MouseEvent) {
            if (listOptionsRef.current && !listOptionsRef.current.contains(e.target as Node)) disable();
        }
        document.addEventListener('mousedown', onMouseDown);
        return () => {
            document.removeEventListener('mousedown', onMouseDown);
        };
    }, [disable])
    if (!isOption || !list) return;

    
    let listItem = document.querySelector('[data-list-id = "' + list?.id + '"]');
    let listTop : string = `${listItem?.getBoundingClientRect().top?  listItem?.getBoundingClientRect().top + window.scrollY: 0}px`;



    return (
        <ul ref={listOptionsRef} className='flex flex-col absolute left-[100%] shadow-2xl bg-white dark:bg-[#1B405E] rounded-lg *:border-b-1 *:p-2.5 *:pr-8 *:pl-3 *:last:border-none *:cursor-pointer *:hover:bg-[#E1E8ED] *:hover:dark:bg-[#082338] *:rounded-md *:transition-all *:duration-200 *:ease-in-out *:flex *:flex-row' style={{top: listTop}}>
            {!list.completed && <li
                onClick={() => {onPin?.(list.id); disable();}}
            >
                <i className="fas fa-thumbtack relative pr-3 top-1"></i>{list.pinned? "Unpin": "Pin"}
            </li>}
            <li
                onClick={() => {onEdit?.(list.id); disable();}}
            >
                <i className="fas fa-pencil relative pr-3 top-1"></i>Rename
            </li>
            <li
                onClick={() => {onDelete?.(list.id); disable();}}
            >
                <i className="fas fa-trash relative pr-3 top-1"></i>Delete
            </li>
        </ul>
    )
}


export default ListOptions;