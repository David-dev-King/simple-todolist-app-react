
import { useState, useEffect } from 'react';

import type { todoList, } from "../App";
import { Lists } from "../App";
import { setCurrentList, addList, editList, pinList, deleteList } from "../App";
import { eventBus } from '../App';
import ListContent from "./ListContent";
import ListOptions from './ListOptions';
import EditListForm from './EditListForm';
import ScreenOverlay from './ScreenOverlay';
import DeletePanel from './DeletePanel';



interface ListSideProps {
}

function ListSide({} : ListSideProps) {
    const [lists, setLists] = useState<todoList[]>([...Lists]);
    const [displayedLists, setDisplayedLists] = useState<todoList[]>([...Lists]);

    const [selectedList, setSelectedList] = useState<todoList | null>(null)
    
    const [isOption, setOptions] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);


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
        <div className='
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
            h-screen
            transition-all
            duration-500
            ease-in-out
            '>
                <ScreenOverlay active={isEditing||isDeleting} />
                <EditListForm isEditing={isEditing} list={selectedList?selectedList:undefined} onSubmit={(id, newName) => {(id && newName) && editList(id, newName); setIsEditing(false)}} onblur={()=>{setIsEditing(false)}} />
                <DeletePanel list={selectedList?selectedList:undefined} isDeleting={isDeleting} onDelete={(id) => {deleteList(id);}} disable={() => {setIsDeleting(false);}} />
                <ListOptions isOption={isOption} onDelete={() => {setIsDeleting(true);}} onPin={(id) => {pinList(id);}} onEdit={() => setIsEditing(true)} disable={disableOptions} list={selectedList && {...selectedList}} />
                <ListContent
                    lists={displayedLists} setCurrentList={(id) => {setCurrentList(id);}}
                    addList={(name) => {addList(name);}}
                    filterLists={(query) => {setDisplayedLists(Lists.filter(l => l.name.toLowerCase().includes(query.toLowerCase())))}}
                    setOptions={(value, list)=>{setOptions(value); list && setSelectedList({...list});}}
                    />
                <div className='right-arrow-container sticky top-0 h-screen flex items-center justify-center p-5'>
                    <i className="fas fa-arrow-right absolute top-1/2 right-1/2 -translate-y-1/2 text-3xl text-gray-400 hover:text-gray-600 cursor-pointer"></i>
                </div>
        </div>
    );
}
export default ListSide;