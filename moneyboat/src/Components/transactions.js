import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './transactions.css';
import axios from "axios";

export const Transactions = () => {
    const [isAddTransaction, setIsAddTransaction] = useState(false);
    const [Transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true); 
    const [fetchError, setFetchError] = useState("");
    const navigate = useNavigate();
    const [newTransaction, setNewTransaction] = useState({
        category: "",
        transfer_type: "",
        transaction_type: "",
        source: "",
        destination: "",
        amount_spent: "",
        reason: "",
        tuuid: "",
        date: "",
    });

    const handleAddTransaction = () => {
        setIsAddTransaction(true);
    };

    const handleInputChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        setNewTransaction({ ...newTransaction, [name]: value });
    };

    const closeAddTransaction = (e) => {
        setIsAddTransaction(false);
    };

    useEffect(() => {
        const fetchTransactions = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await axios.get('http://localhost:5000/fetchtransactions', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setTransactions(response.data.transactions);
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
        fetchTransactions();
    }, []);

    const AddNewTransaction = async (e) => {
        e.preventDefault();

        // Check if all fields are filled
        if (Object.values(newTransaction).some((value) => value === "")) {
            alert("Please fill in all fields.");
            return;
        }

        const token = localStorage.getItem('token');

        try {
            const response = await axios.post('http://localhost:5000/addtransaction', newTransaction, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });

            if (response.data.message === "Successfully Added") {
                alert(response.data.message);
                setTransactions([...Transactions, newTransaction]);
                setNewTransaction({
                    category: "",
                    transfer_type: "",
                    transaction_type: "",
                    source: "",
                    destination: "",
                    amount_spent: "",
                    reason: "",
                    tuuid: "",
                    date: "",
                });
                setIsAddTransaction(false);
            } else {
                    const {transaction_type,transfer_type} = newTransaction;
                    console.log(transaction_type);
                    if(transfer_type==='self'){
                        if(transaction_type==='bank'){
                            if(response.data.message==='S'){
                        
                                alert('Sending Account is not added in accounts , click ok to redirect to accounts');
                                
                            } else{
                                alert('Receiving Account is not added in accounts , click ok to redirect to accounts');
                            }
                        } else if(transaction_type==='bankTocard'){
                            if(response.data.message==='S'){
                                console.log(response.data.message);
                                alert('Sending Account is not added in accounts , click ok to redirect to accounts');
                            } else{
                                console.log(response.data.message);
                                alert('Receiving Card is not added in Vault , click ok to redirect to Vault');
                            }
                        } else {
                            if(response.data.message==='S'){
                                alert('Sending Card is not added in Vault , click ok to redirect to Vault');
                            } else{
                                alert('Receiving Card is not added in Vault , click ok to redirect to Vault');
                            }
                        }
                    }
                
            }
        } catch (err) {
            console.error("Error adding transaction:", err.response?.data?.message || err.message);
            alert("There was an error while adding the transaction.");
        } 
    };

    return (
        <div className="Transactions">
            <div className="checkTransactions">Hey , Captain do you want to add a new transaction</div>
            {isAddTransaction ? (
                <div className="addTransactionsForm">
                    <div className="close-addTransaction-btn" onClick={closeAddTransaction}>X</div>
                    <form >
                        <input
                            type='text'
                            list='categories'
                            name='category'
                            id='category'
                            value={newTransaction.category}
                            placeholder='choose Category'
                            onChange={handleInputChange}
                            required
                        />
                        <datalist id='categories'>
                            <option value="Rent"/>
                            <option value="Groceries"/>
                            <option value="Transport"/>
                            <option value="Eating Out"/>
                            <option value="Health"/>
                            <option value="Entertainment"/>
                            <option value="Fuel"/>
                            <option value="Bank Transfer"/>
                        </datalist>
                        <select
                            name="transfer_type"
                            id="transfer_type"
                            value={newTransaction.transfer_type}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Transfer Type</option>
                            <option value="self">Self</option>
                            <option value="incoming">Incoming</option>
                            <option value="outgoing">Outgoing</option>
                        </select>

                        {newTransaction.transfer_type === "self" && (
                            <>
                                <select
                                    name="transaction_type"
                                    id="transaction_type"
                                    value={newTransaction.transaction_type}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select Transaction Type</option>
                                    <option value="bank">Bank Transfer</option>
                                    <option value="bankTocard">Bank to Card</option>
                                    <option value="cardReload">Card Reload</option>
                                </select>

                                {newTransaction.transaction_type === "bank" && (
                                    <>
                                        <input
                                            type="text"
                                            name="source"
                                            id="source"
                                            placeholder="Enter Sender bank account number"
                                            value={newTransaction.source}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <input
                                            type="text"
                                            name="destination"
                                            id="destination"
                                            placeholder="Enter destination account number"
                                            value={newTransaction.destination}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </>
                                )}

                                {newTransaction.transaction_type === "bankTocard" && (
                                    <>
                                        <input
                                            type="text"
                                            name="source"
                                            id="source"
                                            placeholder="Enter Sender Account number"
                                            value={newTransaction.source}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <input
                                            type="text"
                                            name="destination"
                                            id="destination"
                                            placeholder="Enter destination card number"
                                            value={newTransaction.destination}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </>
                                )}
                                {newTransaction.transaction_type === "cardReload" && (
                                    <>
                                        <input
                                            type="text"
                                            name="source"
                                            id="source"
                                            placeholder="Enter Credit/Debit card number"
                                            value={newTransaction.source}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <input
                                            type="text"
                                            name="destination"
                                            id="destination"
                                            placeholder="Enter destination card number"
                                            value={newTransaction.destination}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </>
                                )}
                            </>
                        )}

                        {newTransaction.transfer_type === "incoming" && (
                            <>
                                <select
                                    name="transaction_type"
                                    id="transaction_type"
                                    value={newTransaction.transaction_type}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="bank">Bank Transfer</option>
                                </select>
                                <input
                                    type="text"
                                    name="source"
                                    id="source"
                                    placeholder="Enter Sender Name"
                                    value={newTransaction.source}
                                    onChange={handleInputChange}
                                    required
                                />
                                <input
                                    type="text"
                                    name="destination"
                                    id="destination"
                                    placeholder="Enter your Receiving account number"
                                    value={newTransaction.destination}
                                    onChange={handleInputChange}
                                    required
                                />
                            </>
                        )}

                        {newTransaction.transfer_type === "outgoing" && (
                            <>
                                <select
                                    name="transaction_type"
                                    id="transaction_type"
                                    value={newTransaction.transaction_type}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select Transaction Type</option>
                                    <option value="bank">Bank Transfer</option>
                                    <option value="cardPay">Card Payments</option>
                                </select>

                                {newTransaction.transaction_type === "bank" && (
                                    <>
                                        <input
                                            type="text"
                                            name="source"
                                            id="source"
                                            placeholder="Enter Sending bank account number"
                                            value={newTransaction.source}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <input
                                            type="text"
                                            name="destination"
                                            id="destination"
                                            placeholder="Enter Recipient Name"
                                            value={newTransaction.destination}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </>
                                )}

                                {newTransaction.transaction_type === "cardPay" && (
                                    <>
                                        <input
                                            type="text"
                                            name="source"
                                            id="source"
                                            placeholder="Enter Card Number"
                                            value={newTransaction.source}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <input
                                            type="text"
                                            name="destination"
                                            id="destination"
                                            placeholder="Enter Recipient Name"
                                            value={newTransaction.destination}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </>
                                )}
                            </>
                        )}
                        <input
                            type="text"
                            name="amount_spent"
                            id="amount_spent"
                            placeholder="Amount"
                            value={newTransaction.amount_spent}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="date"
                            name="date"
                            id="date"
                            value={newTransaction.date}
                            placeholder="Enter Date"
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="text"
                            name="tuuid"
                            id="tuuid"
                            placeholder="Enter Transaction ID"
                            value={newTransaction.tuuid}
                            onChange={handleInputChange}
                            required
                        />

                        <textarea
                            name="reason"
                            id="reason"
                            value={newTransaction.reason}
                            placeholder="Explain the transaction"
                            onChange={handleInputChange}
                            required
                        ></textarea>
                        <div className="Addbtn" onClick={AddNewTransaction}>Add</div>
                    </form>
                </div>
            ) : (
                <div className="addnewtransaction" onClick={handleAddTransaction}>Add Transaction</div>
            )}

            <div className="Transaction-List">
                <div className="T-Table">
                    <h2>All Transactions</h2>
                    {loading ? (
                        <p>Loading accounts...</p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Category</th>
                                    <th>Transaction Type</th>
                                    <th>{"Sender(Name/Acc/Card no.)"}</th>
                                    <th>{"Receiver(Name/Acc/Card no.)"}</th>
                                    <th>Date of Transaction</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(Transactions) && Transactions.length > 0 ? (
                                    Transactions.map((trans, index) => (
                                        <tr key={trans.tuuid}>
                                            <td>{trans.category}</td>
                                            <td>{trans.transfer_type}</td>
                                            <td>{trans.source}</td>
                                            <td>{trans.destination}</td>
                                            <td>{trans.date}</td>
                                            <td>$ {trans.amount_spent}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6">No transactions found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
                {fetchError && <span>{fetchError}</span> }
            </div>
        </div>
    );
};
