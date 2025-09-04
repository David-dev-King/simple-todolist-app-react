
interface UndoButtonProps {
    undoDeleteTask: () => void;
    disabled?: boolean;
}
function UndoButton({undoDeleteTask, disabled}: UndoButtonProps){

    return(
        <div className="flex items-center fixed bottom-10 right-10">
            <button data-disabled={String(disabled)} onClick={() => {undoDeleteTask();}} className="p-1 pl-5 pr-5 data-[disabled=true]:opacity-50 rounded-xl data-[disabled=false]:hover:bg-amber-100 dark:data-[disabled=false]:hover:bg-amber-500 outline-amber-50 data-[disabled=false]:hover:outline-2 data-[disabled=false]:hover:shadow-[0_0_10px_1px_theme('colors.amber.500')] data-[disabled=false]:hover:scale-150 *:rotate-45 data-[disabled=false]:hover:*:rotate-[-20deg] transition-all duration-200 ease-in-out">
                <i className='fas fa-undo transition-all duration-200 ease-in-out'></i>
            </button>
        </div>
    )
}

export default UndoButton;