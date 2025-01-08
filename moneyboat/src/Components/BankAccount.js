import React, { useEffect, useState } from "react";
import './BankAccount.css';
import axios from "axios";
import { useNavigate } from "react-router";
import { Header } from "./header.js";

export const BankAccount = () => {
    const [isAddAccount, setIsAddAccount] = useState(false);
    const [accounts, setAccounts] = useState([]);
    const [newAccount, setNewAccount] = useState({
        bank_name: "",
        account_no: "",
        account_type: "",
        balance: "",
    });
    const [loading, setLoading] = useState(true); 
    const [error,setError] = useState("");
    const [fetchError,setFetchError] = useState("");
    const handleAddAccount = () => {
        setIsAddAccount(true);
    };

    const handleInputChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        setNewAccount({ ...newAccount, [name]: value });
    };

    useEffect(() => {
        const fetchAccounts = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await axios.get('http://localhost:5000/fetchaccounts', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setAccounts(response.data.accounts);
                    setLoading(false); 
                } catch (err) {
                    let error = err.response?.data?.message || "An error occurred while fetching accounts.";
                    setFetchError(error);
                    setLoading(false); 
                }
            } else {
                setLoading(false);
            }
        };
        fetchAccounts();
    }, []); 

    // Add account handler
    const addAccount = async (e) => {
        e.preventDefault(); // Prevent form submission
    
        if (!newAccount.bank_name || !newAccount.account_no || !newAccount.account_type || !newAccount.balance) {
            setError("Fill all the fields");
            return;
        }

        const token = localStorage.getItem('token');
        try {
            const response = await axios.post('http://localhost:5000/addaccount', newAccount, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });
            alert(response.data.message);
            if (response.data.account) {
                setAccounts([...accounts, response.data.account]);
            }
        } catch (err) {
            console.error("Error details:", err);
            let errorMessage = "An error occurred"; // Default error message
            if (err.response) {
                errorMessage = err.response.data?.message || `Server Error: ${err.response.status}`;
            } else if (err.request) {
                errorMessage = "No response from the server. Please check your network connection.";
            } else {
                errorMessage = err.message || "An unexpected error occurred";
            }
            alert(errorMessage);
        }
        setNewAccount({ bank_name: "", account_no: "", account_type: "", balance: "" });
        setIsAddAccount(false);
    };

    const closeAddAccount = () =>{
        setIsAddAccount(false);
    }

    return (
        <div className="bank-account">
            <div className="Hey">Hey Captain! Manage your Boats</div>
            <div className="Add-Account"> 
                {isAddAccount ? (
                    <div className="addaccountform">
                        <div className="close-addaccount-btn" onClick={closeAddAccount}>X</div>
                        <form>
                            <input
                                type="text"
                                id="bankname"
                                name="bank_name"
                                placeholder="Enter Bank Name"
                                value={newAccount.bank_name}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="text"
                                id="accno"
                                name="account_no"
                                placeholder="Enter your account number"
                                value={newAccount.account_no}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                list="accountTypes"
                                id="accountType"
                                name="account_type"
                                placeholder="Select account type"
                                value={newAccount.account_type}
                                onChange={handleInputChange}
                                required
                            />
                            <datalist id="accountTypes">
                                <option value="Checking" />
                                <option value="Savings" />
                            </datalist>
                            <input
                                type="text"
                                id="balance"
                                name="balance"
                                placeholder="Enter your current account balance"
                                value={newAccount.balance}
                                onChange={handleInputChange}
                                required
                            />
                            <button className="add-button" onClick={addAccount}>Add</button>
                            {error && <span>{error}</span>}
                        </form>
                    </div>
                ) : (
                    <div className='addaccount-btn' onClick={handleAddAccount}>Add Account</div>
                )}
            </div>
            <div className="Account-List">
                <div className="Table">
                    <h2>All Boats</h2>
                    {loading ? (
                        <p>Loading accounts...</p> 
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Bank</th>
                                    <th>Account Number</th>
                                    <th>Type</th>
                                    <th>Balance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {accounts.length > 0 ? (
                                    accounts.map((acc, index) => (
                                        <tr key={index}>
                                            <td>{acc.bank_name}</td>
                                            <td>{acc.account_no}</td>
                                            <td>{acc.account_type}</td>
                                            <td>{acc.balance}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="4">No accounts available.</td></tr> 
                                )}
                            </tbody>
                        </table>
                        
                    )}
                    {fetchError && <span>{fetchError}</span>}
                </div>
            </div>
        </div>
    );
};
