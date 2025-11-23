import express from 'express';
import { body, validationResult } from 'express-validator';
import prisma from '../db/prisma.js';
import { authenticate } from '../middleware/auth.js';
import { createLog, formatLogDetails } from '../utils/logger.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all employees for the organization
router.get('/', async (req, res) => {
  try {
    const employees = await prisma.employee.findMany({
      where: { organizationId: req.user.organizationId },
      include: {
        teams: {
          include: {
            team: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedEmployees = employees.map(emp => ({
      ...emp,
      teams: emp.teams.map(te => te.team)
    }));

    res.json(formattedEmployees);
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get single employee
router.get('/:id', async (req, res) => {
  try {
    const employee = await prisma.employee.findFirst({
      where: {
        id: req.params.id,
        organizationId: req.user.organizationId
      },
      include: {
        teams: {
          include: {
            team: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json({
      ...employee,
      teams: employee.teams.map(te => te.team)
    });
  } catch (error) {
    console.error('Get employee error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create employee
router.post(
  '/',
  [
    body('name').trim().notEmpty(),
    body('email').isEmail().normalizeEmail(),
    body('position').optional().trim()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, position } = req.body;

      const employee = await prisma.employee.create({
        data: {
          name,
          email,
          position: position || null,
          organizationId: req.user.organizationId
        }
      });

      // Log creation
      await createLog(
        req.user.id,
        req.user.organizationId,
        `User '${req.user.id}' added a new employee with ID ${employee.id}`,
        formatLogDetails({ employeeId: employee.id, name, email, position })
      );

      res.status(201).json(employee);
    } catch (error) {
      console.error('Create employee error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

// Update employee
router.put(
  '/:id',
  [
    body('name').optional().trim().notEmpty(),
    body('email').optional().isEmail().normalizeEmail(),
    body('position').optional().trim()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const employee = await prisma.employee.findFirst({
        where: {
          id: req.params.id,
          organizationId: req.user.organizationId
        }
      });

      if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
      }

      const updateData = {};
      if (req.body.name) updateData.name = req.body.name;
      if (req.body.email) updateData.email = req.body.email;
      if (req.body.position !== undefined) updateData.position = req.body.position;

      const updatedEmployee = await prisma.employee.update({
        where: { id: req.params.id },
        data: updateData
      });

      // Log update
      await createLog(
        req.user.id,
        req.user.organizationId,
        `User '${req.user.id}' updated employee ${req.params.id}`,
        formatLogDetails({ employeeId: req.params.id, updates: updateData })
      );

      res.json(updatedEmployee);
    } catch (error) {
      console.error('Update employee error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

// Delete employee
router.delete('/:id', async (req, res) => {
  try {
    const employee = await prisma.employee.findFirst({
      where: {
        id: req.params.id,
        organizationId: req.user.organizationId
      }
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    await prisma.employee.delete({
      where: { id: req.params.id }
    });

    // Log deletion
    await createLog(
      req.user.id,
      req.user.organizationId,
      `User '${req.user.id}' deleted employee ${req.params.id}`,
      formatLogDetails({ employeeId: req.params.id, name: employee.name })
    );

    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;

