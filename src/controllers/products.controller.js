import { getConnection, sql, queries } from '../database';
import { sp_Importacion } from '../database/querys';

export const getProducts = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query(queries.getAllProduct);

        res.json(result.recordset);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

export const createNewProduct = async (req, res) => {

    const { name, description } = req.body;
    let { quantity } = req.body;

    if (name == null || description == null) {
        return res.status(400).json({ msg: 'Bad Request. Llena todos los campos' })
    }

    if (quantity == null) quantity = 0;

    try {
        const pool = await getConnection();

        await pool
            .request()
            .input("name", sql.VarChar, name)
            .input("description", sql.Text, description)
            .input("quantity", sql.Int, quantity)
            .query(queries.createNewProduct)

        res.json({ name, description, quantity });
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

export const getProductById = async (req, res) => {
    const { id } = req.params;

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input("id", id)
            .query(queries.getProductById);

        res.send(result.recordset);

    } catch (error) {
        res.status(500);
        res.send(error.message);
    }


};

export const deleteProductById = async (req, res) => {
    const { id } = req.params;

    try {
        const pool = await getConnection();
        const result = await pool
            .request()
            .input("id", id)
            .query(queries.deleteProduct);

        res.send(result.rowsAffected);


    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

export const getTotalProduct = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool
            .request()
            .query(queries.getTotalProduct);

        res.json(result.recordset[0][''])


    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

export const updateProductById = async (req, res) => {
    const { id } = req.params;

    const { name, description, quantity } = req.body;

    if (name == null || description == null || quantity == null) {
        return res.status(400).json({ msg: 'Bad Request. Llena todos los campos' })
    }
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input("name", sql.VarChar, name)
            .input("description", sql.Text, description)
            .input("quantity", sql.Int, quantity)
            .input("id", sql.Int, id)
            .query(queries.updateProduct);

        res.json({name, description, quantity});

    } catch (error) {
        res.status(500);
        res.send(error.message);
    }


};