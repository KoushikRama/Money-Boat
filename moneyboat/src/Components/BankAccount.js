import React from "react";
import './BankAccount.css';
import { useState } from 'react';

export const BankAccount = () => {

    const [isAddAccount,setIsAddAccount] = useState(false);
    const [accounts,setAccounts] = useState([
        { bank:'Bank of America', accno:'6789178277448', type:'checking', balance:'$ 233543'},
        { bank:'Chase', accno:'3444978178009', type:'savings', balance:'$ 66504'},
        { bank:'Bank of America', accno:'6789202487901', type:'savings', balance:'$ 102788'},
    ]);
    const [newAccount,setNewAccount] = useState({
        bank:"",
        accno:"",
        type:"",
        balance:"",
    });
    const handleAddAccount = () => {
        setIsAddAccount(true);
    }
    const handleInputChange = (e) => {
        const { name , value } = e.target;
        setNewAccount({...newAccount , [name]:value});
    }
    const addAccount = (e) => {
        e.preventDefault();
        setAccounts([...accounts,newAccount]);
        setNewAccount({ bank: "", accno: "", type: "", balance: "" });
        setIsAddAccount(false);
    }
    
    return(
        <div className="bank-account">
            <div className="Hey">Hey Captain! Manage your Boats</div>
            <div className="Add-Account">
                { isAddAccount ? (
                    <div className="addaccountform">
                        <form>
                        <input
                            type="text"
                            id="bankname"
                            name="bank"
                            placeholder="Enter Bank Name"
                            value={newAccount.bank}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="text"
                            id="accno"
                            name="accno"
                            placeholder="Enter your account number"
                            value={newAccount.accno}
                            onChange={handleInputChange}
                            required
                        />
                        <input list="accountTypes" id="accountType" name="type" placeholder="Select account type" value={newAccount.type} onChange={handleInputChange} required/>
                        <datalist id="accountTypes">
                        <option value="Checking"></option>
                        <option value="Savings"></option>
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
                        </form>
                    </div>
                ) : (<div onClick={handleAddAccount}>Add Account</div>)

                }
            </div>
            <div className="Account-List">
            <div className="Table">
                        <h2>All Boats</h2>
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
                                { accounts.map((acc,index) =>
                                (
                                    <tr key={index}>
                                        <td>{acc.bank}</td>
                                        <td>{acc.accno}</td>
                                        <td>{acc.type}</td>
                                        <td>{acc.balance}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
            </div>
        </div>
    );
}
