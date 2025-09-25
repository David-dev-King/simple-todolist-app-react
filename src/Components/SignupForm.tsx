import React, { useState } from 'react';
import { loadTasks, setUserID } from '../App';

/**
 * @param {SignupFormProps} props The props for the SignupForm component.
 * @param {boolean} props.active A boolean to toggle visibility of the form.
 * @param {function():void} props.toggleLogin Callback function to toggle the visibility of the Login form.
 * @param {function():void} props.disableForms Callback function to disable the visibility of both the login form and the signup form.
 * @returns {JSX.Element | null} A form for creating a new user or null if not visible.
 * @description A form with username and password input for creating a new user account.
 * @exports SignupForm
 */

interface SignupFormProps {
    active: boolean;
    toggleLogin: () => void;
    disableForms: () => void;
}


function SignupForm({active, toggleLogin, disableForms} : SignupFormProps) {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [errMessage, setErrMessage] = useState<string>('');

    const handleSubmit = async (event : React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevents the default form submission behavior
        if (password !== confirmPassword) {
            setErrMessage("Passwords do not match");
            return;
        }

    try {
        const trimmedUsername = username.trim();
        const trimmedPassword = password.trim();
        if (trimmedUsername === "" || trimmedPassword === "") {
            setErrMessage("Username and password cannot be empty");
            return;
        }
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await fetch(`${apiUrl}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: trimmedUsername, password: trimmedPassword }),
            credentials: 'include', // Include cookies in the request
      });

      if (response.ok) {
          // User was successfully created
          const newUser = await response.json();
          disableForms();
          localStorage.setItem('accessToken', newUser.accessToken);
          localStorage.setItem('refreshToken', newUser.refreshToken);
          setUserID(newUser.id);
          await loadTasks();
          console.log('User created:', newUser);
          setErrMessage("");
      } else {
          // Handle backend errors
          console.error('Failed to create user:', response.statusText);
          setErrMessage("Username already taken");
      }
    } catch (error) {
        console.error('Error during sign-up:', error);
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
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="confirmPassword" className="block text-lg mb-1">Confirm Password:</label>
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
                  id="confirmPassword"
                  placeholder='Enter your password'
                  required={true}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <p className="text-red-500 italic">{errMessage}</p>
            <div className="flex flex-row items-center justify-between *:inline">
                <p>Already have an account? <span className="text-amber-500 cursor-pointer" onClick={() =>{setUsername(""); setPassword(""); setErrMessage(""); toggleLogin();}}>Log in.</span></p>
                <button type="submit" className="p-4 rounded-xl basis-1/2 bg-amber-300 active:bg-amber-300 hover:bg-amber-500 dark:bg-amber-500 dark:active:bg-amber-500 cursor-pointer dark:hover:bg-amber-600 outline-amber-50 :hover:outline-2 hover:shadow-[0_0_10px_1px_theme('colors.amber.500')] transition-all duration-200 ease-in-out">Sign Up</button>
            </div>
        </form>
    );
}

export default SignupForm;