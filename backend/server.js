const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database');  
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../frontend')));

app.post('/submit-score', (req, res) => {
    const { apelido, tempo, jogadas } = req.body;

    if (!apelido || !tempo || !jogadas) {
        return res.status(400).send('Missing parameters');
    }

    console.log("Score recebido:", { apelido, tempo, jogadas }); 

    const query = `INSERT INTO scores (apelido, tempo, jogadas) VALUES (?, ?, ?)`;
    db.run(query, [apelido, tempo, jogadas], function(err) {
        if (err) {
            console.error('Erro ao inserir score:', err);
            return res.status(500).send('Erro ao inserir score');
        }
        res.status(200).send('Score submitted');
    });
});

app.get('/leaderboard', (req, res) => {
    const query = `SELECT apelido, tempo, jogadas FROM scores ORDER BY tempo ASC, jogadas ASC`;
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Erro ao obter ranking:', err);
            return res.status(500).send('Erro ao obter ranking');
        }

        console.log("Ranking enviado:", rows); 

        res.status(200).json(rows);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
