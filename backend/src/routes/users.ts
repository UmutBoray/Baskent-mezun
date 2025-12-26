import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../db.js';

const router = express.Router();

interface JwtPayload {
  userId: string;
  email: string;
}

// JWT Middleware
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'dev-secret'
    ) as JwtPayload;
    (req as any).userId = decoded.userId;
    (req as any).email = decoded.email;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Get user profile
router.get('/profile', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const result = await pool.query(
      `SELECT id, first_name, last_name, email, workplace, location, sector, 
              seniority, position, points, streak, is_active, created_at 
       FROM users WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.patch('/profile', authMiddleware, async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { first_name, last_name, workplace, location, sector, seniority, position } = req.body;

  try {
    const result = await pool.query(
      `UPDATE users 
       SET first_name = COALESCE($1, first_name),
           last_name = COALESCE($2, last_name),
           workplace = COALESCE($3, workplace),
           location = COALESCE($4, location),
           sector = COALESCE($5, sector),
           seniority = COALESCE($6, seniority),
           position = COALESCE($7, position),
           updated_at = now()
       WHERE id = $8
       RETURNING id, first_name, last_name, email, workplace, location, sector, seniority, position`,
      [first_name, last_name, workplace, location, sector, seniority, position, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'Profile updated', user: result.rows[0] });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user by ID (public)
router.get('/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      `SELECT id, first_name, last_name, workplace, location, sector, seniority, position, points, streak
       FROM users WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('User fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
