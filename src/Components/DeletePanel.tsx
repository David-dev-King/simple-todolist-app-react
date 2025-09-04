import { useEffect, useRef } from "react";
import type { todoList } from "../App";

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
        <div ref={deletePanelRef} className="z-6 fixed w-xl rounded-2xl top-[25vh] left-[35vw] bg-white dark:bg-[#0C2940] flex flex-col items-center">
            <span className="p-4 border-b-1">Are you sure you want to delete? This action cannot be undone.</span>
            <div className="flex w-full *:flex-1/2 *:cursor-pointer *:p-4 *:hover:bg-[#E1E8ED] dark:*:hover:bg-amber-600 *:transition-all *:duration-200 *:ease-in-out">
                <button className="rounded-bl-2xl" onClick={() => {disable();}}>Cancel</button>
                <button className="rounded-br-2xl" onClick={() => {onDelete?.(list.id); disable();}}>Delete</button>
            </div>
        </div>
    );

}

export default DeletePanel;