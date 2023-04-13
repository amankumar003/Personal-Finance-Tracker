const transactionForm = document.getElementById("transaction-form");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const incomeList = document.getElementById("income-list");
const expensesList = document.getElementById("expenses-list");
const balance = document.getElementById("balance");

let transactions = [];
fetchTransactions();

transactionForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    await addTransaction();
});

async function fetchTransactions() {
    try {
        const response = await fetch('/api/transactions');
        transactions = await response.json();
        transactions.forEach(transaction => updateTransactionList(transaction));
        updateBalance();
    } catch (error) {
        console.error('Error fetching transactions:', error);
    }
}

function updateTransactionList(transaction) {
    const list = transaction.amount > 0 ? incomeList : expensesList;
    const listItem = document.createElement("li");
    listItem.dataset.id = transaction.id;
    listItem.innerHTML = `
    ${transaction.description}
    <span>${transaction.amount.toFixed(2)}</span>
    <button class="delete-btn">X</button>
    `;
    list.appendChild(listItem);

    listItem.querySelector(".delete-btn").addEventListener("click", (e) => {
        deleteTransaction(transaction.id);
    });
}

async function addTransaction() {
    const description = descriptionInput.value.trim();
    const amount = parseFloat(amountInput.value.trim());
    if (description && !isNaN(amount)) {
        const transaction = {
            id: parseInt(Date.now()), // Convert the ID to an integer
            description,
            amount,
        };

        try {
            const response = await fetch('/api/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transaction),
            });

            if (response.ok) {
                const savedTransaction = await response.json(); // Process the response from the backend
                transactions.push(savedTransaction);
                updateTransactionList(savedTransaction);
                updateBalance();
                clearInputs();
            }
        } catch (error) {
            console.error('Error adding transaction:', error);
        }
    }
}



async function deleteTransaction(id) {
    try {
        const response = await fetch(`/api/transactions/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            transactions = transactions.filter(transaction => transaction.id !== id);
            const listItem = document.querySelector(`li[data-id="${id}"]`);
            listItem.remove();
            updateBalance();
        }
    } catch (error) {
        console.error('Error deleting transaction:', error);
    }
}

function updateBalance() {
    const income = transactions
        .filter(transaction => transaction.amount > 0)
        .reduce((sum, transaction) => sum + transaction.amount, 0);

    const expenses = transactions
        .filter(transaction => transaction.amount < 0)
        .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);

    const total = income - expenses;

    balance.textContent = `$${total.toFixed(2)}`;
}

function clearInputs() {
    descriptionInput.value = "";
    amountInput.value = "";
}
