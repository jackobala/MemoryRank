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
// Rota para atualizar o ranking em tempo real
app.post('/atualizar-ranking-em-tempo-real', (req, res) => {
    const { apelido, tempo, jogadas } = req.body;

    // Lógica para inserir ou atualizar os dados do jogador vencedor no banco de dados
    db.run(
        'INSERT INTO ranking (apelido, tempo, jogadas) VALUES (?, ?, ?) ON CONFLICT(apelido) DO UPDATE SET tempo = MIN(?, tempo), jogadas = MIN(?, jogadas)',
        [apelido, tempo, jogadas, tempo, jogadas],
        (err) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Erro ao atualizar o ranking em tempo real' });
            } else {
                res.json({ success: true });
            }
        }
    );
});
