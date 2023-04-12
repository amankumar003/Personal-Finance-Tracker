const transactionForm = document.getElementById("transaction-form");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const incomeList = document.getElementById("income-list");
const expensesList = document.getElementById("expenses-list");
const balance = document.getElementById("balance");

let transactions = [];

transactionForm.addEventListener("submit", (e) => {
    e.preventDefault();
    addTransaction();
});

function addTransaction() {
    const description = descriptionInput.value.trim();
    const amount = parseFloat(amountInput.value.trim());
    if (description && !isNaN(amount)) {
        const transaction = {
            id: Date.now(),
            description,
            amount,
        };
        transactions.push(transaction);
        updateTransactionList(transaction);
        updateBalance();
        clearInputs();
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

function deleteTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    const listItem = document.querySelector(`li[data-id="${id}"]`);
    listItem.remove();
    updateBalance();
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
