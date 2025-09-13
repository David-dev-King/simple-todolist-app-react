import { useState } from 'react'
import ScreenOverlay from "./ScreenOverlay"
import LoginForm from "./LoginForm"
import SignupForm from "./SignupForm"


/**
 * @returns {JSX.Element} A react elemement cotaining the sign up login forms.
 * @description A container component for the login and signup forms, managing their visibility and state.
 * @exports SignupForm
 */

function Forms() {
    const [isLoginActive, setIsLoginActive] = useState<boolean>(true);
    const [isSignupActive, setIsSignupActive] = useState<boolean>(false);

    const toggleLogin = () => {
        // Logic to toggle to Signin form
        setIsLoginActive(true);
        setIsSignupActive(false);
    }
    const toggleSignup = () => {
        // Logic to toggle to Signup form
        setIsLoginActive(false);
        setIsSignupActive(true);
    }
    const disableForms = () => {
        setIsLoginActive(false);
        setIsSignupActive(false);
    }
    return (
        <div className={`z-10 fixed inset-0 pointer-events-${isLoginActive||isSignupActive? `auto`: `none`}`}>
            <ScreenOverlay active={isLoginActive||isSignupActive}/>
            <div className='fixed flex inset-0 justify-center items-center'>
                <LoginForm active={isLoginActive} toggleSignup={toggleSignup} disableForms={disableForms}/>
                <SignupForm active={isSignupActive} toggleLogin={toggleLogin} disableForms={disableForms}/>
            </div>
        </div>
  )
}
export default Forms