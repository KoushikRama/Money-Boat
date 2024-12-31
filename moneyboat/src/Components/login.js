import React from "react";
import './login.css';
import { Link } from 'react-router-dom';

const line = './LoginLine.png'
const boat = './boat_inclined.png'
export const Login = () => {
    return (
        <div class='Login-card'>
            <div class='Captions'>
                <div class="Welcome">Welcome Back!</div>
                <div class="Tagline">Continue Tracking your Boats</div>
                <img src={line} id='underline'/>
            </div>
            <div class='login-space'>   
                    <input
                    type="Username"
                    id="Username"
                    name="Username"
                    placeholder="Username"
                    required
                    />
                    <input
                    type="Password"
                    id="Password"
                    name="Password"
                    placeholder="Password"
                    required
                    />
               
                <div class="loggedin">
                    <input type="checkbox" />
                <div id="stay">Stay logged in</div>
                </div>    
                
                    
              
                <button class="Loginbutton">
                    LOGIN
                </button>
                <div class="ForgotPassword"><a href="">Forgot Password?</a></div>
                <div id='dont_have'><p>Don't have an Account?< Link to='/register'>Register for Free</Link> </p></div>
            </div>
            <img src={boat} id='boat'/>
        </div>    );
}