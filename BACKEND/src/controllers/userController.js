const pool = require('../config/db');

// Expresión regular para validar formato de correo
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 1. GET /users -> Devuelve el listado completo en JSON
const getUsers = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT id, nombre, correo FROM usuarios');
    res.status(200).json(result.rows);
  } catch (error) {
    next(error);
  }
};

// 2. POST /users -> Crea un nuevo usuario
const createUser = async (req, res, next) => {
  try {
    const { nombre, correo, contraseña } = req.body;

    // Validaciones de campos obligatorios
    if (!nombre || !correo || !contraseña) {
      return res.status(400).json({ error: 'Todos los campos (nombre, correo, contraseña) son obligatorios.' });
    }

    // Validación de formato de correo
    if (!emailRegex.test(correo)) {
      return res.status(400).json({ error: 'El formato del correo electrónico no es válido.' });
    }

    // Validación de longitud mínima de contraseña
    if (contraseña.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres.' });
    }

    const query = 'INSERT INTO usuarios (nombre, correo, contraseña) VALUES ($1, $2, $3) RETURNING id, nombre, correo';
    const values = [nombre, correo, contraseña];
    const result = await pool.query(query, values);

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      user: result.rows[0]
    });
  } catch (error) {
    // Manejo de error por clave única (correo duplicado)
    if (error.code === '23505') {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado.' });
    }
    next(error);
  }
};

// 3. PUT /users/:id -> Actualiza campos permitidos de un usuario
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, correo, contraseña } = req.body;

    if (!nombre || !correo) {
      return res.status(400).json({ error: 'Nombre y correo son campos obligatorios.' });
    }

    if (!emailRegex.test(correo)) {
      return res.status(400).json({ error: 'El formato del correo electrónico no es válido.' });
    }

    let query, values;

    if (contraseña) {
      if (contraseña.length < 6) {
        return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres.' });
      }
      query = 'UPDATE usuarios SET nombre = $1, correo = $2, contraseña = $3 WHERE id = $4 RETURNING id, nombre, correo';
      values = [nombre, correo, contraseña, id];
    } else {
      query = 'UPDATE usuarios SET nombre = $1, correo = $2 WHERE id = $3 RETURNING id, nombre, correo';
      values = [nombre, correo, id];
    }

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    res.status(200).json({
      message: 'Usuario actualizado correctamente',
      user: result.rows[0]
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'El correo electrónico ya pertenece a otro usuario.' });
    }
    next(error);
  }
};

// 4. DELETE /users/:id -> Elimina un usuario por ID
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM usuarios WHERE id = $1 RETURNING id', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    res.status(200).json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser
};