import express from 'express';
import { body, validationResult } from 'express-validator';
import prisma from '../db/prisma.js';
import { authenticate } from '../middleware/auth.js';
import { createLog, formatLogDetails } from '../utils/logger.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all teams for the organization
router.get('/', async (req, res) => {
  try {
    const teams = await prisma.team.findMany({
      where: { organizationId: req.user.organizationId },
      include: {
        employees: {
          include: {
            employee: {
              select: {
                id: true,
                name: true,
                email: true,
                position: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedTeams = teams.map(team => ({
      ...team,
      employees: team.employees.map(te => te.employee)
    }));

    res.json(formattedTeams);
  } catch (error) {
    console.error('Get teams error:', error);
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

// Get single team
router.get('/:id', async (req, res) => {
  try {
    const team = await prisma.team.findFirst({
      where: {
        id: req.params.id,
        organizationId: req.user.organizationId
      },
      include: {
        employees: {
          include: {
            employee: {
              select: {
                id: true,
                name: true,
                email: true,
                position: true
              }
            }
          }
        }
      }
    });

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.json({
      ...team,
      employees: team.employees.map(te => te.employee)
    });
  } catch (error) {
    console.error('Get team error:', error);
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

// Create team
router.post(
  '/',
  [
    body('name').trim().notEmpty(),
    body('description').optional().trim()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, description } = req.body;

      const team = await prisma.team.create({
        data: {
          name,
          description: description || null,
          organizationId: req.user.organizationId
        }
      });

      // Log creation
      await createLog(
        req.user.id,
        req.user.organizationId,
        `User '${req.user.id}' created a new team with ID ${team.id}`,
        formatLogDetails({ teamId: team.id, name, description })
      );

      res.status(201).json(team);
    } catch (error) {
      console.error('Create team error:', error);
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
  }
);

// Update team
router.put(
  '/:id',
  [
    body('name').optional().trim().notEmpty(),
    body('description').optional().trim()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const team = await prisma.team.findFirst({
        where: {
          id: req.params.id,
          organizationId: req.user.organizationId
        }
      });

      if (!team) {
        return res.status(404).json({ message: 'Team not found' });
      }

      const updateData = {};
      if (req.body.name) updateData.name = req.body.name;
      if (req.body.description !== undefined) updateData.description = req.body.description;

      const updatedTeam = await prisma.team.update({
        where: { id: req.params.id },
        data: updateData
      });

      // Log update
      await createLog(
        req.user.id,
        req.user.organizationId,
        `User '${req.user.id}' updated team ${req.params.id}`,
        formatLogDetails({ teamId: req.params.id, updates: updateData })
      );

      res.json(updatedTeam);
    } catch (error) {
      console.error('Update team error:', error);
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
  }
);

// Delete team
router.delete('/:id', async (req, res) => {
  try {
    const team = await prisma.team.findFirst({
      where: {
        id: req.params.id,
        organizationId: req.user.organizationId
      }
    });

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    await prisma.team.delete({
      where: { id: req.params.id }
    });

    // Log deletion
    await createLog(
      req.user.id,
      req.user.organizationId,
      `User '${req.user.id}' deleted team ${req.params.id}`,
      formatLogDetails({ teamId: req.params.id, name: team.name })
    );

    res.json({ message: 'Team deleted successfully' });
  } catch (error) {
    console.error('Delete team error:', error);
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

// Assign employee to team
router.post(
  '/:teamId/assign',
  [
    body('employeeId').notEmpty()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { teamId } = req.params;
      const { employeeId } = req.body;

      // Verify team belongs to organization
      const team = await prisma.team.findFirst({
        where: {
          id: teamId,
          organizationId: req.user.organizationId
        }
      });

      if (!team) {
        return res.status(404).json({ message: 'Team not found' });
      }

      // Verify employee belongs to organization
      const employee = await prisma.employee.findFirst({
        where: {
          id: employeeId,
          organizationId: req.user.organizationId
        }
      });

      if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
      }

      // Check if assignment already exists
      const existingAssignment = await prisma.teamEmployee.findUnique({
        where: {
          employeeId_teamId: {
            employeeId,
            teamId
          }
        }
      });

      if (existingAssignment) {
        return res.status(400).json({ message: 'Employee is already assigned to this team' });
      }

      // Create assignment
      await prisma.teamEmployee.create({
        data: {
          employeeId,
          teamId
        }
      });

      // Log assignment
      await createLog(
        req.user.id,
        req.user.organizationId,
        `User '${req.user.id}' assigned employee ${employeeId} to team ${teamId}`,
        formatLogDetails({ employeeId, teamId, employeeName: employee.name, teamName: team.name })
      );

      res.status(201).json({ message: 'Employee assigned to team successfully' });
    } catch (error) {
      console.error('Assign employee error:', error);
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
  }
);

// Remove employee from team
router.delete('/:teamId/assign/:employeeId', async (req, res) => {
  try {
    const { teamId, employeeId } = req.params;

    // Verify team belongs to organization
    const team = await prisma.team.findFirst({
      where: {
        id: teamId,
        organizationId: req.user.organizationId
      }
    });

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Verify employee belongs to organization
    const employee = await prisma.employee.findFirst({
      where: {
        id: employeeId,
        organizationId: req.user.organizationId
      }
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Delete assignment
    await prisma.teamEmployee.delete({
      where: {
        employeeId_teamId: {
          employeeId,
          teamId
        }
      }
    });

    // Log removal
    await createLog(
      req.user.id,
      req.user.organizationId,
      `User '${req.user.id}' removed employee ${employeeId} from team ${teamId}`,
      formatLogDetails({ employeeId, teamId, employeeName: employee.name, teamName: team.name })
    );

    res.json({ message: 'Employee removed from team successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    console.error('Remove employee error:', error);
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

