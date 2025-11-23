import prisma from '../db/prisma.js';

export const createLog = async (userId, organizationId, action, details = null) => {
  try {
    await prisma.log.create({
      data: {
        userId,
        organizationId,
        action,
        details
      }
    });
  } catch (error) {
    console.error('Error creating log:', error);
    // Don't throw error - logging should not break the application
  }
};

export const formatLogDetails = (data) => {
  return JSON.stringify(data);
};

