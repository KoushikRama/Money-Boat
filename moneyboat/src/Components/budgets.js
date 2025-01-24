import React, {useState,useEffect} from "react";
import axios from 'axios';
import './budgets.css';

export const Budgets = () => {
    const [isAddLimit,setIsAddLimit]=useState(false);
    const [budgets , setBudgets]=useState([]);
    const [loading, setLoading] = useState(true); 
    const [error,setError] = useState("");
    const [fetchError,setFetchError] = useState("");
    const [newBudget,setNewBudget] = useState({
        category:"",
        budget_limit:"",
    })
    const handleAddLimit =()=>{
        setIsAddLimit(true);
    }
    const handleInputChange = (e) =>{
        e.preventDefault();
        const {name,value}=e.target;
        setNewBudget({...newBudget,[name]:value})
    }
    useEffect(() => {
        const fetchBudgets = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await axios.get('http://localhost:5000/fetchbudgets', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setBudgets(response.data.budgets);
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
        fetchBudgets();
    }, [budgets]); 
    const addBudget =async(e)=>{
        e.preventDefault();
        if(Object.values(newBudget).some((value)=>value==="")){
            alert("please fill all the fields");
            return
        }
        const token = localStorage.getItem('token');

        try{
            const response = await axios.post('http://localhost:5000/addbudgets',newBudget,{
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });
            if(response.data.message==='Succesfully Added'){
                setBudgets([...budgets, newBudget]);
                alert(response.data.message);
            } else {
                alert(response.data.message);
            }
        } catch (err){
            console.log(err.response.data.message);
        }
        setNewBudget({
            category:"",
            budget_limit:"",
        })
        setIsAddLimit(false);
    }
    const closeAddBudget =()=>{
        setIsAddLimit(false);
    }
    return(
        <div className="Budgets">
            <div className="budget-cap">Hey, Captian check your sack limits </div>
            <div className="Add-Limit">
            { isAddLimit ? 
            (   <div className="addbudget-form">
                <div className="close-addbudget-btn" onClick={closeAddBudget}>X</div>
                <form >
                <input
                    type='text'
                    list='categories'
                    name='category'
                    id='category'
                    value={newBudget.category}
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
                </datalist>    
                <input
                    type='text'
                    name='budget_limit'
                    id='budget_limit'
                    placeholder='enter limit eg.(500)'
                    value={newBudget.budget_limit}
                    onChange={handleInputChange}
                    required
                />
                <button className="add-button" onClick={addBudget} >Add</button>
                {error && <span>{error}</span>}
                </form>
                </div>
                ) :
            (<div className="AddLimit-btn" onClick={handleAddLimit}>Add Limits</div>)}
            </div>

            {!loading && <div className="Budget-cards">
                 {budgets.map(budget => (
                    <div className="card" key={budget.category}>
                        <div className="category-name">{budget.category}</div>
                        <div className="budget_limit_amount">${budget.budget_limit}</div>
                    </div>
                ))}
                {fetchError && <span>{fetchError}</span> }
            </div>} 
        </div>
    );

}