import { useEffect, useRef } from "react";
import type { todoList } from "../App";

/**
 * @param {DeletePanelProps} props The props for the DeletePanel component.
 * @param {todoList} [props.list] The to-do item list to be deleted.
 * @param {boolean} [props.isDeleting] A boolean to toggle the display of the delete panel.
 * @param {function(id: number):void} [props.onDelete] Callback function to handle the deletion of a to-do item with the given id.
 * @param {function():void} props.disable Callback function to disable the delete panel.
 * @returns {JSX.Element | null} A delete confirmation panel or null if not visible.
 * @description A React component that displays a confirmation panel for deleting a to-do item.
 * @exports DeletePanel
 */


interface DeletePanelProps{
    list? : todoList;
    isDeleting? : boolean;
    onDelete? : (id: number) => void;
    disable : () => void;
}



function DeletePanel({list, isDeleting, onDelete, disable} : DeletePanelProps){
    const deletePanelRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        function handleMouseDown(e : MouseEvent){
            if (deletePanelRef.current && !deletePanelRef.current.contains(e.target as Node)) disable();
        }
        document.addEventListener("mousedown", handleMouseDown);
        return () => {document.removeEventListener("mousedown", handleMouseDown)};
    }, [disable]);


    if(!list || !isDeleting) return;
    return (
        <div className="!translate-x-0 h-screen w-screen !opacity-100 fixed flex justify-center items-center">
            <div ref={deletePanelRef} className="z-6 w-xl max-lg:w-md max-md:w-xs rounded-2xl bg-white dark:bg-[#0C2940] flex flex-col items-center">
                <span className="p-4 border-b-1">Are you sure you want to delete? This action cannot be undone.</span>
                <div className="flex w-full *:flex-1/2 *:cursor-pointer *:p-4 *:hover:bg-[#E1E8ED] dark:*:hover:bg-amber-600 *:transition-all *:duration-200 *:ease-in-out">
                    <button className="rounded-bl-2xl" onClick={() => {disable();}}>Cancel</button>
                    <button className="rounded-br-2xl" onClick={() => {onDelete?.(list.id); disable();}}>Delete</button>
                </div>
            </div>
        </div>
    );

}

export default DeletePanel;