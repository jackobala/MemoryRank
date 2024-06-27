const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve the frontend files
app.use(express.static(__dirname));

app.post('/submit-score', (req, res) => {
    const { apelido, tempo, jogadas } = req.body;

    if (!apelido || !tempo || !jogadas) {
        return res.status(400).send('Missing parameters');
    }

    console.log("Score recebido:", { apelido, tempo, jogadas });

    const query = `SELECT COUNT(*) AS count FROM scores`;
    db.get(query, [], (err, row) => {
        if (err) {
            console.error('Erro ao verificar contagem de scores:', err);
            return res.status(500).send('Erro ao verificar contagem de scores');
        }

        if (row.count < 5) {
            const insertQuery = `INSERT INTO scores (apelido, tempo, jogadas) VALUES (?, ?, ?)`;
            db.run(insertQuery, [apelido, tempo, jogadas], function(err) {
                if (err) {
                    console.error('Erro ao inserir score:', err);
                    return res.status(500).send('Erro ao inserir score');
                }
                res.status(200).send('Score submitted');
            });
        } else {
            const worstQuery = `SELECT * FROM scores ORDER BY tempo DESC, jogadas DESC LIMIT 1`;
            db.get(worstQuery, [], (err, worstScore) => {
                if (err) {
                    console.error('Erro ao obter pior score:', err);
                    return res.status(500).send('Erro ao obter pior score');
                }

                if (tempo < worstScore.tempo || (tempo === worstScore.tempo && jogadas < worstScore.jogadas)) {
                    const deleteQuery = `DELETE FROM scores WHERE id = ?`;
                    db.run(deleteQuery, [worstScore.id], function(err) {
                        if (err) {
                            console.error('Erro ao deletar pior score:', err);
                            return res.status(500).send('Erro ao deletar pior score');
                        }

                        const insertQuery = `INSERT INTO scores (apelido, tempo, jogadas) VALUES (?, ?, ?)`;
                        db.run(insertQuery, [apelido, tempo, jogadas], function(err) {
                            if (err) {
                                console.error('Erro ao inserir score:', err);
                                return res.status(500).send('Erro ao inserir score');
                            }
                            res.status(200).send('Score submitted');
                        });
                    });
                } else {
                    res.status(200).send('Score not high enough to enter leaderboard');
                }
            });
        }
    });
});

app.get('/leaderboard', (req, res) => {
    const query = `SELECT apelido, tempo, jogadas FROM scores ORDER BY tempo ASC, jogadas ASC LIMIT 5`;
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Erro ao obter ranking:', err);
            return res.status(500).send('Erro ao obter ranking');
        }

        console.log("Ranking enviado:", rows);

        res.status(200).json(rows);
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
