import express from 'express';
import mysql from 'mysql2/promise';

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

//for Express to get values using POST method
app.use(express.urlencoded({extended:true}));

//setting up database connection pool
const pool = mysql.createPool({
    host: "l6slz5o3eduzatkw.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "gssqs8dukmiv9z1b",
    password: "ls31v0rctb7qsheu",
    database: "f86z33msqsuec99p",
    connectionLimit: 10,
    waitForConnections: true
});

//routes
app.get('/', async (req, res) => {
    let authorSql = `SELECT authorId, firstName, lastName
                FROM q_authors
                ORDER BY lastName`;
    const [authorRows] = await pool.query(authorSql);


    //attempting to add Search By Category dropdown
    let category = req.query.category;
    let categorySql = `SELECT DISTINCT category
                        FROM q_quotes`;
    // let categorySql =`SELECT authorId, firstName, lastName, quote, category
    //          FROM q_quotes
    //          NATURAL JOIN q_authors
    //          WHERE category = ?`;
    let categorySqlParams = [category];
   const [categoryRows] = await pool.query(categorySql, categorySqlParams);

   res.render("index", {"authors": authorRows, categoryRows});
});

app.get("/dbTest", async(req, res) => {
   try {
        const [rows] = await pool.query("SELECT CURDATE()");
        res.send(rows);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error");
    }
});//dbTest

app.get('/searchByKeyword', async(req, res) => {
   let keyword = req.query.keyword;
   let sql =`SELECT authorId, firstName, lastName, quote, likes
             FROM q_quotes
             NATURAL JOIN q_authors
             WHERE quote LIKE ?`;
    let sqlParams = [`%${keyword}%`];
   const [rows] = await pool.query(sql, sqlParams);
   console.log(rows[0])
   res.render("results",{"quotes":rows});
});//searchByKeyword

app.get('/searchByAuthor', async(req, res) => {
   let userAuthorId = req.query.authorId;
   let sql =`SELECT authorId, firstName, lastName, quote, likes
             FROM q_quotes
             NATURAL JOIN q_authors
             WHERE authorId = ?`;
    let sqlParams = [userAuthorId];
   const [rows] = await pool.query(sql, sqlParams);
   console.log(rows[0])
   res.render("results",{"quotes":rows});
});//searchByAuthor

app.get('/api/author/:id', async(req, res) => {
    let authorId = req.params.id;
    let sql = `SELECT *
                FROM q_authors
                WHERE authorId = ?`;
    const [rows] = await pool.query(sql, [authorId]);
    res.send(rows);
});


app.get('/searchByCategory', async (req, res) => {
   const category = req.query.category;

   const sql = `SELECT authorId, firstName, lastName, quote, category, likes
                FROM q_quotes
        NATURAL JOIN q_authors
     WHERE category = ?`;

   const [rows] = await pool.query(sql,[category]);

   res.render("results",{"quotes":rows});
});

app.get('/searchByLikes', async(req, res) => {
   let likesLow = req.query.likesLow;
   let likesHigh = req.query.likesHigh;
   let sql =`SELECT authorId, firstName, lastName, quote, likes
             FROM q_quotes
             NATURAL JOIN q_authors
             WHERE likes BETWEEN ? and ?`;
    let sqlParams = [likesLow, likesHigh];
   const [rows] = await pool.query(sql, sqlParams);
   console.log(rows[0])
   res.render("results",{"quotes":rows});
});//searchByLikes in progress



app.listen(3000, ()=>{
    console.log("Express server running")
})

 