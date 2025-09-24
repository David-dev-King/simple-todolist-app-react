import type { todoList } from '../App';

/**
 * @param {ListItemProps} props The props for the ListItem component.
 * @param {todoList} props.list The single to-do list object to be rendered.
 * @param {function(id: number):void} props.setCurrentList Callback function to set the currently selected to-do list based on its ID.
 * @param {function(value: boolean, list?: todoList):void} props.setOptions Callback function to toggle the display of the options menu for a list.
 * @returns {JSX.Element} A component that displays a single to-do list item.
 * @description A visual representation of a single to-do list item.
 * @exports ListItem
 */


interface ListItemProps {
    list: todoList;
    setCurrentList: (id: number) => void;
    setOptions: (value : boolean, list? : todoList) => void;
}
function ListItem({ list, setCurrentList, setOptions } : ListItemProps) {
    return (
        <li data-list-id={list.id} className={`
                        p-4
                        mb-4
                        max-lg:p-3
                        max-lg:mb-3
                        relative
                        rounded-lg
                        cursor-pointer
                        outline-amber-50
                        ${list.current ? 'bg-amber-600 hover:!bg-amber-600 [&_button]:hover:!bg-amber-700 text-white' : 'bg-[#CED7DE] text-black dark:bg-[#051A2B] dark:text-white'}
                        hover:bg-blue-400
                        dark:hover:bg-[#1B405E]
                        hover:text-white
                        hover:[&_button]:!opacity-100
                        max-xl:[&_button]:!opacity-100
                        transition-all
                        duration-200
                        ease-in-out
                        ` + (list.current ? "shadow-[0_0_20px_1px_theme('colors.amber.500')] outline-2" : 'shadow-md')
                    }
                    onClick={(e) => {if(!(e.target as HTMLElement).closest("button"))setCurrentList(list.id);}}
                    >
                        <h2 className="text-2xl max-lg:text-xl font-semibold">{list.name}</h2>
                        <p className="text-md max-lg:text-sm">{list.tasks.length} tasks {list.tasks.filter(t => !t.completed).length? "| " + list.tasks.filter(t => !t.completed).length + " tasks pending" : ""}</p>
                        {list.pinned && !list.completed && <i className='fas fa-thumbtack absolute right-[4%] top-[10%]'></i>}
                        <div className="absolute right-[4%] top-0 h-full flex items-center">
                            <button className="relative cursor-pointer p-4 dark:hover:bg-[#0C2940] hover:bg-blue-500 rounded-full opacity-0 transition-all duration-200 ease-in-out" onClick={() => {setOptions(true, list)}}><i className="fas fa-ellipsis-v"></i></button>
                        </div>
                    </li>
    );
}
export default ListItem;