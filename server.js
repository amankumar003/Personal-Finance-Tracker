const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

const transactionsFilePath = './transactions.json';

// Load transactions from file
let transactions = [];
if (fs.existsSync(transactionsFilePath)) {
    const fileContents = fs.readFileSync(transactionsFilePath, 'utf-8');
    transactions = JSON.parse(fileContents);
}

// Get transactions
app.get('/api/transactions', (req, res) => {
    res.json(transactions);
});

// Add transaction
app.post('/api/transactions', (req, res) => {
    const transaction = req.body;
    transactions.push(transaction);
    fs.writeFileSync(transactionsFilePath, JSON.stringify(transactions));
    res.status(201).json(transaction);
});

// Delete transaction
app.delete('/api/transactions/:id', (req, res) => {
    const id = parseInt(req.params.id);
    transactions = transactions.filter(transaction => transaction.id !== id);
    fs.writeFileSync(transactionsFilePath, JSON.stringify(transactions));
    res.status(204).end();
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
