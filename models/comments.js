const db = require('./../db_connection');

class Comment {

    constructor({ id, post_id, content }) {
        this.id = id;
        this.post_id = post_id;
        this.content = content;
    }


    static async getByPostId(id){
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM comments WHERE post_id = ?';
            const values = [id];
            db.query(sql, values, function (error, results, fields) {
                if (error) reject(error);
                
                resolve(results)
            });
        })
    }

    async create() {
        const sql = `
            INSERT INTO comments
                (post_id, content)
            VALUES
                (?, ?)
            `;
        const values = [this.post_id, this.content]

        const result = await db.query(sql, values, function (error, results, fields) {
            if (error) throw error;
        });
    }

}


module.exports = Comment;