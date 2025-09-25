import React, { useState } from 'react';
import { loadTasks, setUserID } from '../App';

/**
 * @param {LoginFormProps} props The props for the LoginForm component.
 * @param {boolean} props.active A boolean to toggle visibility of the form.
 * @param {function():void} props.toggleSignup Callback function to toggle the visibility of the Sign up form.
 * @param {function():void} props.disableForms Callback function to disable the visibility of both the login form and the signup form.
 * @returns {JSX.Element | null} A form for logging a user into their account or null if not visible.
 * @description A form with username and password input for logging a user into their account.
 * @exports LoginForm
 */



interface LoginFormProps {
    active: boolean;
    toggleSignup: () => void;
    disableForms: () => void;
}

function LoginForm({active, toggleSignup, disableForms} : LoginFormProps) {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errMessage, setErrMessage] = useState<string>("");


    const handleSubmit = async (event : React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevents the default form submission behavior

        try {
            const trimmedUsername = username.trim();
            const trimmedPassword = password.trim();
            if (trimmedUsername === "" || trimmedPassword === "") {
                setErrMessage("Username and password cannot be empty");
                return;
            }
            const apiUrl = import.meta.env.VITE_API_URL;
            const response = await fetch(`${apiUrl}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: trimmedUsername, password: trimmedPassword }),
                credentials: 'include', // Include cookies in the request
        });

        if (response.ok) {
            // User was successfully logged in
            const user = await response.json();
            disableForms();
            localStorage.setItem('accessToken', user.accessToken);
            localStorage.setItem('refreshToken', user.refreshToken);
            setUserID(user.id);
            await loadTasks();
            console.log('User logged in:', user.message);
            setErrMessage("");
        } else {
            // Handle backend errors
            console.error('Failed to log user in:', response.statusText);
            setErrMessage("Invalid username or password");
        }
      } catch (error) {
          console.error('Error during login:', error);
      }
    };

    if (!active) return null;

    return (
      
        <form onSubmit={handleSubmit} className='bg-[#E1E8ED] dark:bg-[#0C2940] relative w-xl gap-4 flex flex-col justify-between z-6 p-6 rounded-2xl shadow-md m-4 *:w-full'>
            <div>
                <label htmlFor="username" className="block text-lg mb-1">Username:</label>
                <input
                    className="
                        bg-white
                        text-gray-800
                        w-full
                        outline-amber-100
                        focus:shadow-[0_0_10px_1px_theme('colors.amber.500')]
                        p-3
                        rounded-full
                        transition-all
                        duration-200
                        ease-in-out
                        "
                  type="text"
                  id="username"
                  placeholder='Enter your username'
                  required={true}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="password" className="block text-lg mb-1">Password:</label>
                <input
                    className="
                        bg-white
                        text-gray-800
                        w-full
                        outline-amber-100
                        focus:shadow-[0_0_10px_1px_theme('colors.amber.500')]
                        p-3
                        rounded-full
                        transition-all
                        duration-200
                        ease-in-out
                        "
                  type="password"
                  id="password"
                  placeholder='Enter your password'
                  required={true}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <p className="text-red-500 italic">{errMessage}</p>
            <div className="flex flex-row items-center justify-between *:inline">
                <p>Don't have an account? <span className="text-amber-500 cursor-pointer" onClick={() =>{setUsername(""); setPassword(""); toggleSignup();}}>sign up.</span></p>
                <button type="submit" className="p-4 rounded-xl basis-1/2 bg-amber-300 active:bg-amber-300 hover:bg-amber-500 dark:bg-amber-500 dark:active:bg-amber-500 cursor-pointer dark:hover:bg-amber-600 outline-amber-50 :hover:outline-2 hover:shadow-[0_0_10px_1px_theme('colors.amber.500')] transition-all duration-200 ease-in-out">Log In</button>
            </div>
        </form>
    );
}

export default LoginForm;