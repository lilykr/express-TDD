// app.js
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const connection = require('./connection');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.post('/bookmarks', (req, res) => {
    const { url, title } = req.body;
    if (!title || !url) {
        res.status(422).json({ error: "required field(s) missing" })
    } else {
        connection.query(
            "INSERT INTO bookmark (url, title) VALUES (?, ?)", [url, title],
            (err, results) => {
                if (err) {
                    console.log(err)
                    res.status(500).send("error saving a bookmark")
                } else {
                    res.status(201).send({ id: results.insertId, url: url, title: title })
                }
            }
        )
    }
})

app.get('/bookmarks/:id', (req, res) => {
    const { id } = req.params;
    connection.query("SELECT * FROM bookmark WHERE id = ?", [id],
        (error, results) => {
            if (error) {
                res.status(500).send({ error: 'Error retrieving data' })
            } else {
                if(results.length === 0) {
                    return res.status(404).send({error: 'Bookmark not found'})
                }
                return res.status(200).json(results[0]);
            }
        })
})


module.exports = app;