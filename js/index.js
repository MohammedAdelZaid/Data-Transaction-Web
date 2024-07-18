const data = 
{
"customers": [
{
"id": 1,
"name": "Ahmed Ali"
},
{
"id": 2,
"name": "Aya Elsayed"
},

{
"id": 3,
"name": "Mina Adel"
},
{
"id": 4,
"name": "Sarah Reda"
},
{
"id": 5,
"name": "Mohamed Sayed"
}
],
"transactions": [
{
"id": 1,
"customer_id": 1,
"date": "2022-01-01",
"amount": 1000
},
{
"id": 2,
"customer_id": 1,
"date": "2022-01-02",
"amount": 2000
},
{
"id": 3,
"customer_id": 2,
"date": "2022-01-01",
"amount": 550
},
{
"id": 4,
"customer_id": 3,
"date": "2022-01-01",
"amount": 500
},
{
"id": 5,

"customer_id": 2,
"date": "2022-01-02",
"amount": 1300
},
{
"id": 6,
"customer_id": 4,
"date": "2022-01-01",
"amount": 750
},
{
"id": 7,
"customer_id": 3,
"date": "2022-01-02",
"amount": 1250
},
{
"id": 8,
"customer_id": 5,
"date": "2022-01-01",
"amount": 2500
},
{
"id": 9,
"customer_id": 5,
"date": "2022-01-02",
"amount": 875
}
]
}




let customerTableBody = document.getElementById('customer-table');



function getId(id) {


    for(let i=0 ; i<data.customers.length;i++){

if(data.customers[i].id===id)
{
    return data.customers[i].name;
}
}
// console.log("id",id)
return  "";


}

///////////////////////////////////////////////////////////////



function loadInTable(transactions) {



    let cartona = '';

for (let i = 0; i < transactions.length; i++) {


    let transaction = transactions[i];
    let customerName = getId(transaction.customer_id);

    cartona += `
        <tr>
            <td>${customerName}</td>
            <td>${transaction.date}</td>
            <td>${transaction.amount}</td>
        </tr>
    `;
}

customerTableBody.innerHTML = cartona;




    
}

///////////////////////////////////filter the table///////////////////////

let filterNameInput = document.getElementById('filter-name');
let filterAmountInput = document.getElementById('filter-amount');


function filterTable() {
    let filterName = filterNameInput.value;
    let filterAmount = filterAmountInput.value;


    let filteredTransactions = data.transactions.filter(function(transaction) {


        let customerName = getId(transaction.customer_id);

        return customerName.toLowerCase().includes(filterName.toLowerCase())
         && (isNaN(filterAmount) || 
         transaction.amount >= filterAmount);
    });

    loadInTable(filteredTransactions);
}

//////////////////////////////////////drawing chart////////////////////////


let ctx = document.getElementById('transactionChart');
let chart;

function drawChart(customerId) {


    let transactions = data.transactions.filter(function(transaction) {
        return transaction.customer_id === customerId;
    });

    let transactionAmounts = {};


    for (let i = 0; i < transactions.length; i++) {
        let transaction = transactions[i];
     

        // Check if the date is already in the transactionAmounts object and   not, initialize of 0

if (transactionAmounts[transaction.date] === undefined) {
    transactionAmounts[transaction.date] = 0;
}

        transactionAmounts[transaction.date] += transaction.amount;
    }

    let labels = Object.keys(transactionAmounts);
    let amounts = Object.values(transactionAmounts);

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Transaction Amounts',
                data: amounts,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Date of Transactions'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Amount'
                    }
                }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    loadInTable(data.transactions);
    filterNameInput.addEventListener('input', filterTable);
    filterAmountInput.addEventListener('input', filterTable);

    // Initial chart for the first customer
    drawChart(1);

    filterNameInput.addEventListener('input', function() {
        let customerName = filterNameInput.value.toLowerCase();
        let customer = data.customers.find(function(c) {
            return c.name.toLowerCase().includes(customerName);
        });
        if (customer) {
            drawChart(customer.id);
        }
    });
});

