import React , { useState } from "react";
import './Register.css';
import { Navigate, useNavigate } from "react-router-dom";
const voyage = './Voyage.png';

export const Register = () => {
    // Defining the States
    const [email,setEmail] = useState("");
    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");
    const [confirmPassword,setConfirmPassword] = useState("");
    const [checkPrivacy,setCheckPrivacy] = useState("");

    //defing the errors states
    const [errors,setErrors] = useState({
        email:"",
        username:"",
        password:"",
        confirmPassword:"",
        checkPrivacy:"",

    });

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        let formErrors = { ...errors};
        //email check
        if(!email){
            formErrors.email = "*required";
        }
        else{
            formErrors.email = "";
        }
        //username check
        if(!username){
            formErrors.username = "*required";
        }
        else{
            formErrors.username = "";
        }
        //password check
        if(!password){
            formErrors.password = "*required";
        }
        else{
            formErrors.password = "";
        }
        //confirmPassword check
        if(!confirmPassword){
            formErrors.confirmPassword = "*required";
        }
        else{
            formErrors.confirmPassword = "";
            if(password!==confirmPassword){
                formErrors.confirmPassword="passwords doesn't match";
            }
            else{
                formErrors.confirmPassword = "";
            }
        }
        //comparing passwod and confirmPassword
        
        //checkbox check for privacy
        if(!checkPrivacy){
            formErrors.checkPrivacy = "You must agree to the Privacy Policy";
        }
        else{
            formErrors.checkPrivacy = "";
        }

        if(Object.values(formErrors).some((error) => error!=="")){
            setErrors(formErrors);
            return;
        }

        alert("Form submitted successfully!");

        navigate('/login');
    }

    return (
        <div class='Register-card'>
            < form onSubmit = {handleSubmit} >
            <div id='phone_cap'>You're one step away from your MoneyBoat voyage!</div>
            <div class='Register-space'>  
                <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                />
                {errors.email && <span className="errors">{errors.email}</span>}
                <input
                type="Username"
                id="eUsername"
                name="eUsername"
                placeholder="Username"
                value={username}
                onChange={(e)=>setUsername(e.target.value)}
                />
                {errors.username && <span className="errors">{errors.username}</span>}
                <input
                type="Password"
                id="ePassword"
                name="ePassword"
                placeholder="Password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                />
                {errors.password && <span className="errors">{errors.password}</span>}
                <input
                type="Password"
                id="ePassword"
                name="ePassword"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e)=>setConfirmPassword(e.target.value)}
                />
                {errors.confirmPassword && <span className="errors">{errors.confirmPassword}</span>}
                <div class="Privacy">
                    <input type="checkbox" checked={checkPrivacy} onChange={(e)=>setCheckPrivacy(e.target.checked)}/>
                <div id="Priv">Confirm for agreeing with Privacy Policy</div>
                </div>
                {errors.checkPrivacy && <span className="errors">{errors.checkPrivacy}</span>}    
                <button class="Signup">
                    Sign Up
                </button>            
            </div>
            </form>
            <div class="design">
                <div id='cap'>You're one step away from your <span class='.mainCap'>MoneyBoat voyage!</span></div>
                <img src={voyage} id='voyage'/>
            </div>
        </div> 
    );
}