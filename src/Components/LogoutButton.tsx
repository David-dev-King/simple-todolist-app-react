
/**
 * @returns {JSX.Element} A button to log out the user.
 * @description A React component for a button that logs out the user by clearing tokens from local storage and reloading the page.
 * @exports LogoutButton
 */
function LogoutButton() {

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.reload();
    }

    return (
        <div className="flex items-center fixed top-5 right-10">
            <button onClick={handleLogout} className="cursor-pointer p-2 pl-7 pr-7 rounded-xl outline-amber-50
            hover:bg-amber-100 dark:hover:bg-amber-500 hover:outline-2 hover:shadow-[0_0_10px_1px_theme('colors.amber.500')] hover:scale-130
            active:bg-amber-100 dark:active:bg-amber-500 active:outline-2 active:shadow-[0_0_10px_1px_theme('colors.amber.500')] active:scale-150
            transition-all duration-200 ease-in-out">
                <i className="fa-solid fa-right-from-bracket text-3xl"></i>
            </button>
        </div>
    )
}

export default LogoutButton