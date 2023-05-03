//REST API
const express = require('express');
const endpoints = express.Router();
const connection = require('./../db_connection');
const Post = require('./../models/posts');

endpoints.get('/api/stats', (req, res) => {
    let users_count;
    let posts_count;

    connection.query(`SELECT COUNT(*) AS total_users FROM users`, (error, users) => {
        if (error) throw (error);
            users_count = users[0].total_users;

            connection.query(`SELECT COUNT(*) AS total_posts FROM posts`, (error, posts) => {
                if (error) throw (error);
                    posts_count = posts[0].total_posts;

                    res.json({ users_count, posts_count });
            });
    });
});

module.exports = endpoints;