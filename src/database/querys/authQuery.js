


export const authQuerys = {

    getAllUsers: 'SELECT * FROM control_Funcionarios',
    getUserById: 'SELECT * FROM control_Funcionarios WHERE ID = @id',
    getUserByRut: 'SELECT * FROM control_Funcionarios WHERE Rut = @rut',
    deleteUserById: 'DELETE FROM control_Funcionarios WHERE ID = @id',
    createNewUser: 'INSERT INTO control_Funcionarios OUTPUT Inserted.ID VALUES(@rut, @rutReloj, @empresa, @clave, @correo, @estado)',
    updateUserById: `
                        UPDATE 
                            control_Funcionarios 
                        SET
                            Empresa = @empresa,
                            clave = @clave,
                            Correo = @correo,
                            Estado = @estado
                        WHERE
                            ID = @id
                    `,
    sp_control_FuncionariosSelect: 'sp_control_FuncionariosSelect'

}