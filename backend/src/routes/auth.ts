import express, { Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db.js';

const router = express.Router();

interface RegisterBody {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

interface LoginBody {
  email: string;
  password: string;
}

// Register
router.post('/register', async (req: Request, res: Response) => {
  const { first_name, last_name, email, password }: RegisterBody = req.body;

  try {
    // Email zaten var mı kontrol et
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Parola hash'le
    const passwordHash = await bcryptjs.hash(password, 10);

    // User oluştur
    const result = await pool.query(
      `INSERT INTO users (first_name, last_name, email, password_hash)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, first_name, last_name, created_at`,
      [first_name, last_name, email, passwordHash]
    );

    const user = result.rows[0];

    // JWT token oluştur
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      user,
      token,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
  const { email, password }: LoginBody = req.body;
  
  console.log('🔐 Login attempt:', { email, passwordLength: password?.length });

  try {
    // User bul
    console.log('📊 Querying database for user...');
    const result = await pool.query(
      `SELECT id, email, password_hash, first_name, last_name, is_admin FROM users WHERE email = $1`,
      [email]
    );
    console.log('📊 Query result rows:', result.rows.length);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];

    // Parola doğru mu kontrol et
    const isValid = await bcryptjs.compare(password, user.password_hash);

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // JWT token oluştur
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: '7d' }
    );

    // Admin kontrolü - artık database'den oku
    const isAdmin = user.is_admin === true;

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        isAdmin,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    console.error('Error details:', (error as any)?.message || 'Unknown error');
    res.status(500).json({ error: 'Internal server error', details: (error as any)?.message });
  }
});

export default router;
