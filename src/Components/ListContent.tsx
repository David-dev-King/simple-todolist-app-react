import type { todoList } from '../App';

import ListItem from './ListItem';
import NewListForm from './NewListForm';

/**
 * @param {ListContentProps} props The props for the ListContent component.
 * @param {todoList[]} props.lists The lists to be rendered.
 * @param {function(id: number):void} props.setCurrentList Callback function to set the currently selected to-do list based on its ID.
 * @param {function(value: boolean, list?: todoList):void} props.setOptions Callback function to toggle the display of the options menu for a list.
 * @param {function(name: string):void} props.addList Callback function to create a new to-do list with a given name.
 * @param {function(query: string):void} [props.filterLists] Callback function to filter the rendered to-do lists based on a search query.
 * @returns {JSX.Element} A container component that displays all to-do lists, a search bar, and a list creation form.
 * @description A main React component that manages and displays all user to-do lists and related actions on the list side of the application interface.
 * @exports ListContent
 */


interface ListContentProps {
    lists: todoList[];
    setCurrentList: (id: number) => void;
    setOptions: (value : boolean, list? : todoList) => void;
    addList: (name: string) => void;
    filterLists?: (query: string) => void;
}
function ListContent({ lists, setCurrentList, addList, filterLists , setOptions } : ListContentProps) {
    return (
        <div className='p-8 w-full h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
            <h1 className="text-5xl max-lg:text-3xl max-lg:mt-5 max-lg:mb-5 font-bold mt-10 mb-10">To-do Lists</h1>
            <NewListForm onSubmit={addList} onChange={filterLists} />
            <h2 className="text-3xl max-lg:text-2xl font-semibold mt-10 mb-5">Pending</h2>
            {lists.filter(l => !l.completed).length == 0 && <p className="text-gray-500">No pending lists 🥳</p>}
            <ul>
                {lists.map(list => !list.completed && list.pinned && (
                    <ListItem key={list.id} list={list} setCurrentList={setCurrentList} setOptions={setOptions} />
                ))}
                {lists.map(list => !list.completed && !list.pinned && (
                    <ListItem key={list.id} list={list} setCurrentList={setCurrentList} setOptions={setOptions} />
                ))}
            </ul>
            <h2 className="text-3xl max-lg:text-2xl font-semibold mt-10 mb-5">Completed</h2>
            {lists.filter(l => l.completed).length == 0 && <p className="text-gray-500">No completed lists 😔</p>}
            <ul>
                {lists.map(list => list.completed && (
                    <ListItem key={list.id} list={list} setCurrentList={setCurrentList} setOptions={setOptions} />
                ))}
            </ul>
        </div>
    );
}
export default ListContent;