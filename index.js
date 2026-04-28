const express = require('express');
const { Pool } = require('pg');
const cors = require('cors')
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    connectionString : process.env.DATABASE_URL,
    ssl : {
        rejectUnauthorized : false
    }
});

// Prints API Message
app.get('/',async(req,res)=>{
    try{
        res.json({message : "CONNECTED SUCCESSFULLY......!"});
    }catch(err)
    {
        res.status(500).json({erro:err.message});
    }
});

// Show API Actual Data
app.get('/users',async(req,res)=>{
    try{
        const result = await pool.query('select * from users');
        res.json(result.rows);
    }catch(err)
    {
        res.status(500).json({erro:err.message});
    }
});

// Post Route. Code To Post Data To API
app.post('/users', async (req, res) => {
    try {
        const { name, email } = req.body;

        const result = await pool.query(
            'INSERT INTO users(name,email) VALUES($1,$2) RETURNING *',
            [name, email]
        );

        res.json({
            message: "User Added Successfully",
            data: result.rows[0]
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Put Route. Code To Update Data IN API
// app.put('/users/:id', async (req, res) => {
//     try {
//         const id = req.params.id;
//         const { name, email } = req.body;

//         const result = await pool.query(
//             'UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *',
//             [name, email, id]
//         );

//         res.json({
//             message: "User Updated Successfully",
//             data: result.rows[0]
//         });

//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// Put Route. Code To Update Data IN API, 2nd Way
// app.put('/users/:id', async (req, res) => {
//     try {
//         const id = parseInt(req.params.id);
//         const { name, email } = req.body;

//         const result = await pool.query(
//             'UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *',
//             [name, email, id]
//         );

//         if (result.rows.length === 0) {
//             return res.status(404).json({
//                 message: "User not found"
//             });
//         }

//         res.json({
//             message: "Updated Successfully",
//             data: result.rows[0]
//         });

//     } catch (err) {
//         res.status(500).json({
//             error: err.message
//         });
//     }
// });

// Put Route. Code To Update Data IN API, 3nd Way and nothing worked for update.
app.post('/updateUser', async (req, res) => {
    try {
        const { id, name, email } = req.body;

        const result = await pool.query(
            'UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *',
            [name, email, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            message: "Updated Successfully",
            data: result.rows[0]
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Data From API
app.post('/deleteUser', async (req, res) => {
    try {
        const { id } = req.body;

        const result = await pool.query(
            'DELETE FROM users WHERE id=$1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            message: "Deleted Successfully",
            data: result.rows[0]
        });

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT,()=>{
    console.log(`SERVER RUNNING ON PORT ${PORT}`);
})