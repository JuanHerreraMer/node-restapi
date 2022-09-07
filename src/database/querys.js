export const queries = {
    getAllProduct: 'SELECT * FROM Products',
    createNewProduct: 'INSERT INTO Products (name, description, quantity) VALUES (@name, @description, @quantity)',
    getProductById: 'SELECT * FROM Products where Id = @Id',
    deleteProduct: 'DELETE FROM Products where Id = @Id',
    getTotalProduct: 'SELECT COUNT(*) FROM Products',
    updateProduct: 'UPDATE Products SET Name = @name, Description = @description, Quantity = @quantity WHERE Id = @Id'
}
