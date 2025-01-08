import React , {useState,useEffect} from "react";
import './vault.css';
import axios from "axios";

export const Vault = () => {
    const [isAddCard , setISAddCard] = useState(false);
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true); 
    const [error,setError] = useState("");
    const [fetchError,setFetchError] = useState("");

    const [newCard,setNewCard] = useState({
        card_type: "",
        issuer: "",
        card_number: "",
        card_name: "",
        balance: "",
        limit: "",
        account_no: "",
        expiry_month: "",
        expiry_year: "",
        account_holder: "",
    })
    const handleAddCard = () => {
        setISAddCard(true);
    }

    const handleInputChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        setNewCard(({ ...newCard, [name]: value })); 
    };

    const closeAddCard = () =>{
        setISAddCard(false);
    }

    useEffect(() => {
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
        fetchCards();
    }, []); 

    const addCard = async (e) => {
        e.preventDefault();
        if (Object.values(newCard).some((value) => value === "")) {
            alert("Please fill in all fields.");
            return;
          }

        const token = localStorage.getItem('token');

        try{
            const response = await axios.post('http://localhost:5000/addcard',newCard,{
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });
            if(response.data.message){
                setCards([...cards, newCard]);
            }
        } catch (err){
            console.log(err.response.data.message);
        }
        
        setNewCard({
            card_type: "",
            issuer: "",
            card_number: "",
            card_name: "",
            balance: "0",
            limit: "0",
            account_no: "",
            expiry_month: "",
            expiry_year: "",
            account_holder: "",
        });
        setISAddCard(false);
    }
    

    const creditCards = Array.isArray(cards) ? cards.filter(card => card.card_type === 'Credit') : [];
    const debitCards = Array.isArray(cards) ? cards.filter(card => card.card_type === 'Debit') : [];
    const prepaidCards = Array.isArray(cards) ? cards.filter(card => card.card_type === 'Prepaid') : [];

    return(
        <div className="wallet-section">
            <div className="hey-vault">Hey, Cap check your vaults </div>
            <div className="Card Vaults">
            {isAddCard ? (
                    <div className="addcardform">
                        <div className="close-addcard-btn" onClick={closeAddCard}>X</div>
                        <form>
                            <input
                                list="cardTypes"
                                id="cardType"
                                name="card_type"
                                placeholder="Select card type"
                                value={newCard.card_type}
                                onChange={handleInputChange}
                                required
                            />
                            <datalist id="cardTypes">
                                <option value="Credit" />
                                <option value="Debit" />
                                <option value="Prepaid" />
                            </datalist>

                            <input
                                type="text"
                                id="issuer"
                                name="issuer"
                                placeholder="Issuer (e.g., Visa, MasterCard)"
                                value={newCard.issuer}
                                onChange={handleInputChange}
                                required
                            />

                            <input
                                type="text"
                                id="cardNumber"
                                name="card_number"
                                placeholder="Card Number (e.g., 1234-5678-9876-5432)"
                                value={newCard.card_number}
                                onChange={handleInputChange}
                                required
                            />

                            <input
                                type="text"
                                id="cardName"
                                name="card_name"
                                placeholder="Card Name (e.g., Gold Credit Card)"
                                value={newCard.card_name}
                                onChange={handleInputChange}
                                required
                            />

                            <input
                                type="number"
                                id="balance"
                                name="balance"
                                placeholder="Balance (e.g., 1500)"
                                value={newCard.balance}
                                onChange={handleInputChange}
                                required
                            />

                            <input
                                type="number"
                                id="limit"
                                name="limit"
                                placeholder="Limit (e.g., 5000)"
                                value={newCard.limit}
                                onChange={handleInputChange}
                                required
                            />

                            <input
                                type="text"
                                id="accountNo"
                                name="account_no"
                                placeholder="Account Number (e.g., ACC123456)"
                                value={newCard.account_no}
                                onChange={handleInputChange}
                                required
                            />

                            <input
                                type="number"
                                id="expiryMonth"
                                name="expiry_month"
                                placeholder="Expiry Month (e.g., 12)"
                                min="1"
                                max="12"
                                value={newCard.expiry_month}
                                onChange={handleInputChange}
                                required
                            />

                            <input
                                type="number"
                                id="expiryYear"
                                name="expiry_year"
                                placeholder="Expiry Year (e.g., 25)"
                                min="23"
                                max="99"
                                value={newCard.expiry_year}
                                onChange={handleInputChange}
                                required
                            />

                            <input
                                type="text"
                                id="accountHolder"
                                name="account_holder"
                                placeholder="Account Holder Name (e.g., John Doe)"
                                value={newCard.account_holder}
                                onChange={handleInputChange}
                                required
                            />

                            <button className="add-button" onClick={addCard} >Add</button>
                            {error && <span>{error}</span>}
                        </form>
                    </div>
                ) : (
                    <div className="Add-Card" onClick={handleAddCard}>Add Card</div>
                )}
                

                { !loading && creditCards.length!==0 && <div className="Credit-Vault">
                    <div className="vault-title">Credit vault</div>
                    <div className="cards">
                    {creditCards.map(card => (
                    <div className="card" key={card.card_number}>
                        <h3>{card.card_name}</h3>
                        <div className="Isser">Issuer: {card.issuer}</div>
                        <div className="card_no">Card Number: {card.card_number}</div>
                        <div className="balance">Statement Balance: ${card.balance}</div>
                        <div className="credits">Credits Available: ${card.limit - card.balance}</div>
                        <div className="limit">Limit: ${card.limit}</div>
                        <div className="Expirydate">Expiration Date: {card.expiry_month}/{card.expiry_year}</div>
                    </div>))}
                    </div> 
                </div> }
                {!loading && debitCards.length!==0 && <div className="Debit-Vault">
                    <div className="vault-title">Debit vault</div>
                    <div className="cards">
                    {debitCards.map(card => (
                    <div className="card" key={card.card_number}>
                        <h3>{card.card_name}</h3>
                        <div className="Isser">Issuer: {card.issuer}</div>
                        <div className="card_no">Card Number: {card.card_number}</div>
                        <div className="balance">Balance: ${card.balance}</div>
                        <div className="Expirydate">Expiration Date: {card.expiry_month}/{card.expiry_year}</div>
                    </div>))}
                    </div>
                </div> }
                { !loading && prepaidCards.length!==0 && <div className="Prepaid-Vault">
                    <div className="vault-title">Prepaid vault</div>
                    <div className="cards">
                    {prepaidCards.map(card => (
                    <div className="card" key={card.card_number}>
                        <h3>{card.card_name}</h3>
                        <div className="Isser">Issuer: {card.issuer}</div>
                        <div className="card_no">Card Number: {card.card_number}</div>
                        <div className="balance">Balance: ${card.balance}</div>
                        <div className="Expirydate">Expiration Date: {card.expiry_month}/{card.expiry_year}</div>
                    </div>))}
                    </div>
                </div> }
                {fetchError && <span>{fetchError}</span> }
            </div>
        </div>
        
    );
}