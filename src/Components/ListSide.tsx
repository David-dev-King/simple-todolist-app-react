
import { useState, useEffect, useRef } from 'react';

import type { todoList, } from "../App";
import { Lists } from "../App";
import { setCurrentList, addList, editList, pinList, deleteList } from "../App";
import { eventBus } from '../App';
import ListContent from "./ListContent";
import ListOptions from './ListOptions';
import EditListForm from './EditListForm';
import ScreenOverlay from './ScreenOverlay';
import DeletePanel from './DeletePanel';


/**
 * @returns {JSX.Element} A component that displays to-do list side of the page.
 * @description A component for the enitre to-do list side of the page, housing the scren overlay, the edit task form, the delete panel, the list options and the list content, and well as handling all their functionality.
 * @exports ListSide
 */



function ListSide() {
    const [, setLists] = useState<todoList[]>([...Lists]);
    const [displayedLists, setDisplayedLists] = useState<todoList[]>([...Lists]);

    const [selectedList, setSelectedList] = useState<todoList | null>(null)
    
    const [isOption, setOptions] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    const [isActive, setIsActive] = useState<boolean>(false);
    
    const listSideRef = useRef<HTMLDivElement>(null);
    

    useEffect(() => {
        function handleClick(e : MouseEvent){
            if(listSideRef.current && !listSideRef.current.contains(e.target as Node)) setIsActive(false);
        }
        document.addEventListener("click", handleClick);
        return () => {document.removeEventListener("click", handleClick);};
    }, []);

    // Reload the lists everytime the "onLists" event is dispatched
    useEffect(() => {
        function setListsFunc(){ console.log("Lists Loaded"); setLists([...Lists]); setDisplayedLists([...Lists]); };
        eventBus.addEventListener("onLists", setListsFunc);
        return () => {eventBus.removeEventListener("onLists", setListsFunc)}
    }, []);
    document.onkeydown = (e) => {
        if (e.key === "Escape" && isEditing) setIsEditing(false);
    };
    
    
    const disableOptions = ()=>{
        setOptions(false);
    }

    return (
        <div ref={listSideRef} className={`
            bg-[#E1E8ED]
            dark:bg-[#0C2940]
            flex
            flex-row
            rounded-r-[30px]
            translate-x-[-80%]
            *:opacity-0
            [&_.right-arrow-container]:opacity-100
            hover:*:opacity-100
            hover:[&_.right-arrow-container]:opacity-0
            ${(isActive || isDeleting) && `translate-x-0! *:opacity-100! [&_.right-arrow-container]:!opacity-100 [&_.right-arrow-container]:scale-x-[-100%]! [&_.right-arrow-container]:translate-x-[-100%]! `}
            hover:translate-x-0
            focus-within:*:opacity-100
            focus-within:[&_.right-arrow-container]:opacity-0
            focus-within:translate-x-0
            *:transition-all
            *:duration-500
            *:ease-in-out
            absolute
            z-4
            max-w-1/4
            max-xl:max-w-2/3
            h-screen
            transition-all
            duration-500
            ease-in-out
            `}>
                <ListOptions isOption={isOption} onDelete={() => {setIsDeleting(true);}} onPin={(id) => {pinList(id);}} onEdit={() => setIsEditing(true)} disable={disableOptions} list={selectedList && {...selectedList}} />
                <ListContent
                    lists={displayedLists}
                    setCurrentList={(id) => {setCurrentList(id); setIsActive(false);}}
                    addList={(name) => {addList(name);}}
                    filterLists={(query) => {setDisplayedLists(Lists.filter(l => l.name.toLowerCase().includes(query.toLowerCase())))}}
                    setOptions={(value, list)=>{setOptions(value); list && setSelectedList({...list});}}
                    />
                <div onClick={() => {setIsActive(active =>!active);}} className='right-arrow-container cursor-pointer sticky top-0 h-screen flex items-center justify-center p-5'>
                    <i className="fas fa-arrow-right absolute top-1/2 right-1/2 -translate-y-1/2 text-3xl text-gray-400 hover:text-gray-600"></i>
                </div>
                <ScreenOverlay active={isEditing||isDeleting} />
                <DeletePanel list={selectedList?selectedList:undefined} isDeleting={isDeleting} onDelete={(id) => {deleteList(id);}} disable={() => {setIsDeleting(false);}} />
                <EditListForm isEditing={isEditing} list={selectedList?selectedList:undefined} onSubmit={(id, newName) => {(id && newName) && editList(id, newName); setIsEditing(false)}} onblur={()=>{setIsEditing(false)}} />
        </div>
    );
}
export default ListSide;