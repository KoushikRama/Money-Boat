import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './transactions.css';
import axios from "axios";

export const Transactions = () => {
    const [isAddTransaction, setIsAddTransaction] = useState(false);
    const [Transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true); 
    const [fetchError, setFetchError] = useState("");
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
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");
    const [accounts, setAccounts] = useState([]);
    const [cards, setCards] = useState([]);
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
                } catch (err) {
                    console.error(err);
                }
            } 
        };
        fetchAccounts();
        const fetchCards = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await axios.get('http://localhost:5000/fetchcards', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setCards(response.data.cards);
                } catch (err) {
                    console.error(err);
                }
            }
        };
        fetchCards();
    }, []); 

    const closeDialog = () => {
        setIsDialogOpen(false);
    }

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
        console.log(newTransaction);
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
                setIsDialogOpen(true);
                setDialogMessage(response.data.message);
                console.log(response.data.message);
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
                                        <select
                                            name="source"
                                            id="source"
                                            value={newTransaction.source}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">-- Select Source Account --</option>
                                            {accounts.map((account) => (
                                                <option key={account.account_no} value={account.account_no}>
                                                    {account.bank_name} (****{account.account_no.slice(-4)})
                                                </option>
                                            ))}
                                        </select>
                                        <select
                                            name="destination"
                                            id="destination"
                                            value={newTransaction.destination}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">-- Select Destination Account --</option>
                                            {accounts.map((account) => (
                                                <option key={account.account_no} value={account.account_no}>
                                                    {account.bank_name} (****{account.account_no.slice(-4)})
                                                </option>
                                            ))}
                                        </select>
                                    </>
                                )}

                                {newTransaction.transaction_type === "bankTocard" && (
                                    <>
                                        <select
                                            name="source"
                                            id="source"
                                            value={newTransaction.source}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">-- Select Sending Account --</option>
                                            {accounts.map((account) => (
                                                <option key={account.account_no} value={account.account_no}>
                                                    {account.bank_name} (****{account.account_no.slice(-4)})
                                                </option>
                                            ))}
                                        </select>
                                        <select
                                            name="destination"
                                            id="destination"
                                            value={newTransaction.destination}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">-- Select Receiving Card --</option>
                                            {cards.map((card) => (
                                                <option key={card.card_number} value={card.card_number}>
                                                    {card.card_name} (****{card.card_number.slice(-4)})
                                                </option>
                                            ))}
                                        </select>
                                    </>
                                )}
                                {newTransaction.transaction_type === "cardReload" && (
                                    <>
                                        <select
                                            name="source"
                                            id="source"
                                            value={newTransaction.source}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">-- Select Sending Card --</option>
                                            {cards.filter(card => card.card_type !== 'Prepaid').map((card) => (
                                                <option key={card.card_number} value={card.card_number}>
                                                    {card.card_name} (****{card.card_number.slice(-4)})
                                                </option>
                                            ))}
                                        </select>
                                        <select
                                            name="destination"
                                            id="destination"
                                            value={newTransaction.destination}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">-- Select Receiving Card --</option>
                                            {cards.filter(card => card.card_type === 'Prepaid').map((card) => (
                                                <option key={card.card_number} value={card.card_number}>
                                                    {card.card_name} (****{card.card_number.slice(-4)})
                                                </option>
                                            ))}
                                        </select>
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
                                    <option value="" disabled>Select Transaction Type</option> 
                                    <option value="bank">Bank Transfer</option>
                                </select>
                                <input
                                    type="text"
                                    name="source"
                                    id="sourcein"
                                    placeholder="Enter Sender Name"
                                    value={newTransaction.source}
                                    onChange={handleInputChange}
                                    required
                                />
                                <select
                                    name="destination"
                                    id="destination"
                                    value={newTransaction.destination}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">-- Select Destination Account --</option>
                                    {accounts.map((account) => (
                                        <option key={account.account_no} value={account.account_no}>
                                            {account.bank_name} (****{account.account_no.slice(-4)})
                                        </option>
                                    ))}
                                </select>
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
                                        <select
                                            name="source"
                                            id="source"
                                            value={newTransaction.source}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">-- Select Source Account --</option>
                                            {accounts.map((account) => (
                                                <option key={account.account_no} value={account.account_no}>
                                                    {account.bank_name} (****{account.account_no.slice(-4)})
                                                </option>
                                            ))}
                                        </select>
                                        <input
                                            type="text"
                                            name="destination"
                                            id="destinationin"
                                            placeholder="Enter Recipient Name"
                                            value={newTransaction.destination}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </>
                                )}

                                {newTransaction.transaction_type === "cardPay" && (
                                    <>
                                        <select
                                            name="source"
                                            id="source"
                                            value={newTransaction.source}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">-- Select Sending Card --</option>
                                            {cards.map((card) => (
                                                <option key={card.card_number} value={card.card_number}>
                                                    {card.card_name} (****{card.card_number.slice(-4)})
                                                </option>
                                            ))}
                                        </select>
                                        <input
                                            type="text"
                                            name="destination"
                                            id="destinationin"
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
                                    <th></th>
                                    <th>Category</th>
                                    <th>Transaction Type</th>
                                    <th>{"Sender(Name/Acc/Card no.)"}</th>
                                    <th>{"Receiver(Name/Acc/Card no.)"}</th>
                                    <th>Date of Transaction</th>
                                    <th>Amount</th>
                                    <th>Reason</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(Transactions) && Transactions.length > 0 ? (
                                    Transactions.map((trans, index) => (
                                        <tr key={trans.tuuid}>
                                            <td>{index+1}</td>
                                            <td>{trans.category}</td>
                                            <td>{trans.transfer_type}</td>
                                            <td>
                                                {
                                                    accounts.find((account) => account.account_no === trans.source)
                                                        ? `${accounts.find((account) => account.account_no === trans.source).bank_name} (****${trans.source.slice(-4)})`
                                                        : cards.find((card) => card.card_number === trans.source)
                                                        ? `${cards.find((card) => card.card_number === trans.source).card_name} (****${trans.source.slice(-4)})`
                                                        : `${trans.source}`
                                                }
                                            </td>
                                            <td>
                                                {
                                                    accounts.find((account) => account.account_no === trans.destination)
                                                        ? `${accounts.find((account) => account.account_no === trans.destination).bank_name} (****${trans.destination.slice(-4)})`
                                                        : cards.find((card) => card.card_number === trans.destination)
                                                        ? `${cards.find((card) => card.card_number === trans.destination).card_name} (****${trans.destination.slice(-4)})`
                                                        : `${trans.destination}`
                                                }
                                            </td>
                                            <td>{trans.date}</td>
                                            <td>$ {trans.amount_spent}</td>
                                            <td>{trans.reason}</td>
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
            {isDialogOpen && (
                <div className="dialogBox">
                    <div className="dialogContent">
                        <p>{dialogMessage}</p>
                        <button onClick={closeDialog}>OK</button>
                    </div>
                </div>
            )}
        </div>
    );
    }
