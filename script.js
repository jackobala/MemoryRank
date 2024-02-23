const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

// Configuração do banco de dados SQLite
const db = new sqlite3.Database('ranking.db');
db.run('CREATE TABLE IF NOT EXISTS ranking(id INTEGER PRIMARY KEY, apelido TEXT, tempo INTEGER, jogadas INTEGER)');

app.use(express.static(__dirname));
app.use(express.json());

// Rota para a página principal
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Rota para obter o ranking
app.get('/ranking', (req, res) => {
    db.all('SELECT * FROM ranking ORDER BY tempo ASC LIMIT 5', (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao buscar o ranking' });
        } else {
            res.json(rows);
        }
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
