require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const validator = require('validator');
const sequelize = require('./db');
const User = require('./models/User');
const Space = require('./models/Space');
const Reservation = require('./models/Reservation');

const app = express();

// Configuración de middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));
app.use(express.json());

// Verificar clave secreta JWT al iniciar
if (!process.env.JWT_SECRET) {
  console.error('ERROR: Falta JWT_SECRET en .env');
  process.exit(1);
}

// Configuración de relaciones
Space.hasMany(Reservation, { foreignKey: 'space_id' });
Reservation.belongsTo(Space, { foreignKey: 'space_id' });

// Middlewares de autenticación
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Token requerido' });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(401).json({ error: 'Usuario no encontrado' });

    req.user = user;
    next();
  } catch (error) {
    console.error('Error de autenticación:', error.message);
    res.status(403).json({ error: 'Token inválido o expirado' });
  }
};

const adminAuth = [authenticate, (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: 'Acceso restringido a administradores' });
  }
  next();
}];

// Helper para hashear contraseñas
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

// RUTAS DE AUTENTICACIÓN
/**
 * @route POST /login
 * @description Autentica un usuario y devuelve un token JWT
 * @access Public
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Object} - Token JWT y datos básicos del usuario
 * @throws {400} - Si faltan email o contraseña
 * @throws {401} - Si las credenciales son inválidas
 * @throws {500} - Error del servidor
 */
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validación de campos requeridos
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        error: 'Email y contraseña son requeridos',
        code: 'AUTH_MISSING_FIELDS'
      });
    }

    // 2. Buscar usuario en la base de datos
    const user = await User.findOne({ 
      where: { email },
      attributes: ['id', 'email', 'password', 'isAdmin', 'createdAt'] // Solo los campos necesarios
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas',
        code: 'AUTH_INVALID_CREDENTIALS'
      });
    }

    // 3. Comparar contraseñas hasheadas
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas',
        code: 'AUTH_INVALID_CREDENTIALS'
      });
    }

    // 4. Generar token JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
        issuer: 'your-app-name', // Identificador de tu app
        audience: 'web-app' // Para quién es el token
      }
    );

    // 5. Responder con datos seguros del usuario
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt
      },
      expiresIn: 3600 // Tiempo de expiración en segundos
    });

  } catch (error) {
    console.error('[AUTH ERROR]', error);
    res.status(500).json({
      success: false,
      error: 'Error en el servidor',
      code: 'SERVER_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// RUTAS DE USUARIO
app.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      email,
      password: hashedPassword,
      isAdmin: false
    });

    res.status(201).json({
      id: user.id,
      email: user.email,
      createdAt: user.createdAt
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// RUTAS PROTEGIDAS
app.get('/users/me', authenticate, async (req, res) => {
  res.json({
    id: req.user.id,
    email: req.user.email,
    isAdmin: req.user.isAdmin,
    createdAt: req.user.createdAt
  });
});

// RUTAS DE ESPACIOS (las existentes, pero protegidas según necesidad)
app.post('/spaces', adminAuth, async (req, res) => {
  try {
    const newSpace = await Space.create(req.body);
    res.status(201).json(newSpace);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear espacio' });
  }
});

// ... (mantén tus otras rutas de spaces y reservations aquí)

// Ruta para obtener espacios
app.get('/spaces', async (req, res) => {
  try {
      const spaces = await Space.findAll();
      res.json(spaces);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener espacios' });
    }
  });
  
  app.post('/spaces', async (req, res) => {
  try {
      const newSpace = await Space.create(req.body);
      res.status(201).json(newSpace);
      } catch (error) {
          res.status(400).json({ error: 'Error al crear el espacio' });
      }
    });
    
  app.get('/spaces/:id', async (req, res) => {
      try {
        const space = await Space.findByPk(req.params.id);
        if (!space) {
          return res.status(404).json({ error: 'Espacio no encontrado' });
        }
        res.json(space);
      } catch (error) {
        res.status(500).json({ error: 'Error al obtener el espacio' });
      }
    });
  
    // 2. Rutas para Reservations (Reservas)
  app.post('/reservations', async (req, res) => {
      try {
        const { space_id, user_email, start_time, end_time } = req.body;
    
        // Validar que el espacio exista
        const space = await Space.findByPk(space_id);
        if (!space) {
          return res.status(404).json({ error: 'Espacio no encontrado' });
        }
    
        // Crear la reserva
        const reservation = await Reservation.create({
          space_id,
          user_email,
          start_time,
          end_time,
          status: 'confirmed'
        });
    
        res.status(201).json(reservation);
      } catch (error) {
        res.status(400).json({ error: 'Error al crear la reserva' });
      }
    });
    
    app.get('/reservations', async (req, res) => {
      try {
        const reservations = await Reservation.findAll({
          include: [{ model: Space }] // Incluye datos del espacio relacionado
        });
        res.json(reservations);
      } catch (error) {
        res.status(500).json({ error: 'Error al obtener reservas' });
      }
    });
    
  /**
   * @desc    Reservar un espacio específico
   * @route   POST /spaces/:id/reserve
   * @body    { user_email, start_time, end_time }
   */
  app.post('/spaces/:id/reserve', async (req, res) => {
    try {
      const { id } = req.params;
      const { user_email, start_time, end_time } = req.body;
  
      // 1. Validar que el espacio exista
      const space = await Space.findByPk(id);
      if (!space) {
        return res.status(404).json({ error: 'Espacio no encontrado' });
      }
  
      // 2. Validar disponibilidad (no reservas solapadas)
      const conflictingReservation = await Reservation.findOne({
        where: {
          space_id: id,
          [Op.or]: [
            { start_time: { [Op.between]: [start_time, end_time] }},
            { end_time: { [Op.between]: [start_time, end_time] }}
          ]
        }
      });
  
      if (conflictingReservation) {
        return res.status(409).json({ error: 'El espacio ya está reservado en ese horario' });
      }
  
      // 3. Calcular costo basado en hourly_rate
      const hours = (new Date(end_time) - new Date(start_time)) / (1000 * 60 * 60);
      const total_cost = (hours * space.hourly_rate).toFixed(2);
  
      // 4. Crear reserva
      const reservation = await Reservation.create({
        space_id: id,
        user_email,
        start_time,
        end_time,
        total_cost,
        status: 'confirmed'
      });
  
      res.status(201).json({
        message: 'Reserva confirmada',
        reservation,
        total_cost: `$${total_cost}`
      });
  
    } catch (error) {
      res.status(500).json({ 
        error: 'Error al crear reserva',
        details: error.message 
      });
    }
  });
  
  /**
   * @desc    Actualizar tarifa por hora de un espacio
   * @route   PATCH /spaces/:id/rate
   * @body    { new_hourly_rate }
   * @access  Privado (solo administradores)
   */
  app.patch('/spaces/:id/rate', async (req, res) => {
    try {
      const { id } = req.params;
      const { new_hourly_rate } = req.body;
  
      // 1. Validar que el nuevo precio sea válido
      if (isNaN(new_hourly_rate) || new_hourly_rate <= 0) {
        return res.status(400).json({ error: 'Tarifa inválida. Debe ser un número positivo' });
      }
  
      // 2. Actualizar tarifa
      const [updated] = await Space.update(
        { hourly_rate: new_hourly_rate },
        { where: { id } }
      );
  
      if (!updated) {
        return res.status(404).json({ error: 'Espacio no encontrado' });
      }
  
      // 3. Obtener el espacio actualizado para responder
      const updatedSpace = await Space.findByPk(id);
      res.json({
        message: 'Tarifa actualizada',
        space: updatedSpace
      });
  
    } catch (error) {
      res.status(500).json({ 
        error: 'Error al actualizar tarifa',
        details: error.message 
      });
    }
  });
  
  
  
  app.get('/test-user', async (req, res) => {
    try {
      console.log('Ejecutando consulta...');
      const users = await User.findAll({
        logging: console.log // Muestra la consulta SQL en consola
      });
      
      console.log('Usuarios encontrados:', JSON.stringify(users, null, 2));
      
      if (!users.length) {
        // Prueba insertar un usuario temporal
        const tempUser = await User.create({
          email: `test-${Date.now()}@test.com`,
          password: 'temp123'
        });
        users.push(tempUser);
      }
      
      res.json(users);
    } catch (error) {
      console.error('Error completo:', error);
      res.status(500).json({ 
        error: error.message,
        stack: error.stack 
      });
    }
  });
  
 
// Registro (solo para admins en producción)
app.post('/users', adminAuth, async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const user = await User.create({ ...req.body, password: hashedPassword });
  res.status(201).json(user);
});

// Login (público)
app.post('/login', async (req, res) => {
  try {
    const token = await login(req.body.email, req.body.password);
    res.json({ token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

app.patch('/spaces/:id/rate', adminAuth, async (req, res) => {
  // Solo usuarios con isAdmin=true pueden acceder
});


/*app.get('/test-user', async (req, res) => {
  try {
    // 1. Consulta directa con SQL puro
    const [results] = await sequelize.query('SELECT * FROM "Users"');
    console.log('Resultados SQL directo:', results);

    // 2. Consulta con Sequelize
    const users = await User.findAll();
    console.log('Resultados Sequelize:', users.map(u => u.toJSON()));

    res.json({
      sqlResults: results,
      sequelizeResults: users
    });

  } catch (error) {
    console.error('Error completo:', error);
    res.status(500).json({ error: error.message });
  }
});*/

// Sincronización e inicio del servidor
// 3. Iniciar servidor

/**
 * @desc    Obtener datos del usuario logueado
 * @route   GET /users/me
 * @access  Privado (requiere autenticación)
 */
app.get('/users/me', authenticate, async (req, res) => {
  try {
    // El middleware 'authenticate' ya añadió req.user
    const user = req.user;

    // Excluir campos sensibles (password) en la respuesta
    const safeUser = {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt
    };

    res.json(safeUser);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener datos del usuario' });
  }
});

/**
 * @desc    Actualizar datos del usuario logueado
 * @route   PATCH /users/me
 * @body    { email?, password? }  // Campos opcionales
 * @access  Privado
 */
app.patch('/users/me', authenticate, async (req, res) => {
  try {
    const { email, password } = req.body;
    const updates = {};

    // Validar y actualizar email (si se envió)
    if (email) {
      if (!validator.isEmail(email)) {
        return res.status(400).json({ error: 'Email inválido' });
      }
      updates.email = email;
    }

    // Actualizar contraseña (si se envió)
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
      }
      updates.password = await bcrypt.hash(password, 10);
    }

    // Aplicar cambios
    await User.update(updates, { where: { id: req.user.id } });

    // Devolver usuario actualizado (sin password)
    const updatedUser = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    res.json({
      message: 'Usuario actualizado',
      user: updatedUser
    });

  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

/**
 * @desc    Eliminar cuenta del usuario logueado
 * @route   DELETE /users/me
 * @access  Privado
 */
app.delete('/users/me', authenticate, async (req, res) => {
  try {
    // Opción 1: Borrar usuario y sus reservas (CASCADE)
    await User.destroy({ 
      where: { id: req.user.id },
      force: true // Borrado permanente (o usar soft delete si lo tienes habilitado)
    });

    // Opción 2: Solo borrar usuario (si Reservation.user_id tiene ON DELETE SET NULL)
    // await User.destroy({ where: { id: req.user.id } });

    res.json({ message: 'Cuenta eliminada correctamente' });

  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar cuenta' });
  }
});

/**
 * @desc    Obtener todos los usuarios (solo admin)
 * @route   GET /users
 * @access  Privado (admin)
 */
app.get('/users', adminAuth, async (req, res) => {
  try {
    // Opción 1: Paginación básica (ej: ?page=1&limit=10)
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const users = await User.findAll({
      attributes: { exclude: ['password'] }, // No mostrar contraseñas
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']] // Ordenar por fecha de creación
    });

    // Opción 2: Contar total de usuarios (para paginación en frontend)
    const totalUsers = await User.count();

    res.json({
      users,
      total: totalUsers,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalUsers / limit)
    });

  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});
 

// MANEJO DE ERRORES CENTRALIZADO
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// INICIO DEL SERVIDOR
async function startServer() {
  try {
    await sequelize.sync({ force: false });
    console.log('✅ Base de datos sincronizada');
    
    // Crear usuario admin si no existe (solo desarrollo)
    if (process.env.NODE_ENV !== 'production') {
      const adminExists = await User.findOne({ where: { isAdmin: true } });
      if (!adminExists) {
        await User.create({
          email: 'admin@example.com',
          password: await hashPassword('Admin123!'),
          isAdmin: true
        });
        console.log('👑 Usuario admin creado (admin@example.com / Admin123!)');
      }
    }

    app.listen(5000, () => {
      console.log('🚀 Servidor en http://localhost:5000');
      console.log('🔒 JWT Secret:', process.env.JWT_SECRET ? 'Configurado' : 'NO CONFIGURADO!');
      console.log('🌍 CORS permitido para:', process.env.FRONTEND_URL || 'http://localhost:3000');
    });
  } catch (error) {
    console.error('❌ Error al iniciar:', error);
    process.exit(1);
  }
}

startServer();




// Relaciones entre las tablas
//Space.hasMany(Reservation, { foreignKey: 'space_id' });
//Reservation.belongsTo(Space, { foreignKey: 'space_id' });


