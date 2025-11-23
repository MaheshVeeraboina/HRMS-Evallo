import express from 'express';
import prisma from '../db/prisma.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all logs for the organization
router.get('/', async (req, res) => {
  try {
    const logs = await prisma.log.findMany({
      where: { organizationId: req.user.organizationId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: req.query.limit ? parseInt(req.query.limit) : 100
    });

    res.json(logs);
  } catch (error) {
    console.error('Get logs error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      meta: error.meta
    });
    res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;

