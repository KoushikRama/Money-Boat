import React, { useState } from "react";
import './login.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const line = './LoginLine.png'
const boat = './boat_inclined.png'
const center = './CenterIcon.png';

export const Login = ({setIsAuthenticated}) => {
    const navigate = useNavigate();
    const [username,setUsername]=useState('');
    const [password,setPassword]=useState('');
    const [checkTicked,setCheckTicked]=useState('');
    const [isLoggingin, setIsLoggingin] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");

    const closeDialog = () => {
        setIsDialogOpen(false);
        if (dialogMessage.includes('Login')) {
            setIsAuthenticated(true);
            navigate('/home');
        }
    }

    const [errors,setErrors]=useState({
        username:"",
        password:"",
        checkTicked:"",
    })

    const handleSubmit = async (e) =>{
        e.preventDefault();

        let formErrors = {...errors};

        if(!username){
            formErrors.username="*required";
        }else{
            formErrors.username="";
        }

        if(!password){
            formErrors.password="*required";
        }else{
            formErrors.password="";
        }

        if(Object.values(formErrors).some((error) => error!=="" )){
            setErrors(formErrors);
            return;
        }

        setIsLoggingin(true);

        try {
            const response = await axios.post('http://localhost:5000/login', {
                username,
                password,
            }, { withCredentials : true });

            localStorage.setItem('token', response.data.token);
            setDialogMessage('Login Successful')

            //window.location.reload();
            setIsDialogOpen(true);
            console.log(localStorage.getItem('token'));
            
            
        } catch (error) {
            // Catch block to handle errors
            if (error.response) {
                setErrors({
                    username: error.response.data.errors.username || "",
                    password: error.response.data.errors.password || "",
                });
                
            } else {
                setErrors({
                    ...errors,
                    username: "An error occurred, please try again.",
                });
            }
        } finally {
            // Finally block to ensure this code runs regardless of success or failure
            setIsLoggingin(false);
        }
    };
    

    return (
        <div class='Login-card'>
            <img src={center} alt='center' className="center"/>
            <div className="main-space">
                <div class='Captions'>
                    <div class="Welcome">Welcome Back!</div>
                    <div class="Tagline">Continue Tracking your Boats</div>
                    <img src={line} alt='line' id='underline'/>
                </div>            
                <div class='login-space'> 
                    <form onSubmit={handleSubmit}>                    
                        <input
                            type="username"
                            id="Username"
                            name="Username"
                            placeholder="Username"
                            value={username}
                            onChange={(e)=>setUsername(e.target.value)}
                            />
                        {errors.username && <span className="errors">{errors.username}</span>}
                        <input
                            type="password"
                            id="Password"
                            name="Password"
                            placeholder="Password"
                            value={password}
                            onChange={(e)=>setPassword(e.target.value)}
                            />
                        {errors.password && <span className="errors">{errors.password}</span>}
                        <div class="loggedin">
                            <input type="checkbox" checked={checkTicked} onChange={(e)=>setCheckTicked(e.target.checked)}/>
                            <div id="stay">Remember me</div>
                        </div>    
                        <button class="Loginbutton" disabled={isLoggingin}>
                        {isLoggingin? 'Loggin in...' : 'LOGIN'}</button>
                    </form>  
                    <div class="ForgotPassword"><a href="/forgot">Forgot Password?</a></div>
                    <div id='dont_have'><p>Don't have an Account?<Link to='/register'> Register for Free</Link> </p></div>
                </div>
                <img src={boat} alt='boat'id='boat'/>
            </div>
            {isDialogOpen && (
                <div className="dialogBoxLogin">
                    <div className="dialogContentLogin">
                        <p>{dialogMessage}</p>
                        <button onClick={closeDialog}>OK</button>
                    </div>
                </div>
            )}
        </div> 

            );
}