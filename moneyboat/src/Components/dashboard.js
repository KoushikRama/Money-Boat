import React from "react";
import './dashboard.css';

const lifebuoy = '/life.png';
    
export const Dashboard =  () => {

    const transactions = [
        { date: "Jan 1", category: "Groceries", amount: "$50", note: "Vegetables" },
        { date: "Jan 2", category: "Rent", amount: "$1,000", note: "January Rent" },
      ];


    return(
        <div className='dash'>
            <div className="greet">
                Ahoy, Captain Username! Ready to sail towards your financial goal
            </div>
            <div className='Stats-pie-Tab'>
                <div className='Stats'>
                    <p>Lets check your Stats</p>
                    <div className="Income">
                        <p>Income</p>
                        <p>$5000</p>
                    </div>
                    <div className="Savings">
                        <p>Savings</p>
                        <p>$4000</p>
                    </div>
                    <div className="Expenditure">
                        <p>Expenses</p>
                        <p>$3000</p>
                    </div>
                </div>
                <div className="pie">
                    This is pie chart
                </div>
                <div className="Table">
                    <h2>Recent Transactions</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Category</th>
                                <th>Amount</th>
                                <th>Note</th>
                            </tr>
                        </thead>
                        <tbody>
                            { transactions.map((txn,index) =>
                            (
                                <tr key={index}>
                                    <td>{txn.date}</td>
                                    <td>{txn.category}</td>
                                    <td>{txn.amount}</td>
                                    <td>{txn.note}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>
            </div>
        </div>
    )
}
