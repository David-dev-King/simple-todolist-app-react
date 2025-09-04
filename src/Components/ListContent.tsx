import type { todoList } from '../App';

import ListItem from './ListItem';
import NewListForm from './NewListForm';

interface ListItemProps {
    lists: todoList[];
    setCurrentList: (id: number) => void;
    setOptions: (value : boolean, list? : todoList) => void;
    addList: (name: string) => void;
    filterLists?: (query: string) => void;
}
function ListContent({ lists, setCurrentList, addList, filterLists , setOptions } : ListItemProps) {
    return (
        <div className='p-8 w-full h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
            <h1 className="text-5xl font-bold mt-10 mb-10">To-do Lists</h1>
            <NewListForm onSubmit={addList} onChange={filterLists} />
            <h2 className="text-3xl font-semibold mt-10 mb-5">Pending</h2>
            {lists.filter(l => !l.completed).length == 0 && <p className="text-gray-500">No pending lists 🥳</p>}
            <ul>
                {lists.map(list => !list.completed && list.pinned && (
                    <ListItem key={list.id} list={list} setCurrentList={setCurrentList} setOptions={setOptions} />
                ))}
                {lists.map(list => !list.completed && !list.pinned && (
                    <ListItem key={list.id} list={list} setCurrentList={setCurrentList} setOptions={setOptions} />
                ))}
            </ul>
            <h2 className="text-3xl font-semibold mt-10 mb-5">Completed</h2>
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