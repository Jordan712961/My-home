import { Router, Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { authMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware';

export const userRoutes = Router();

const userRepository = AppDataSource.getRepository(User);

userRoutes.use(authMiddleware);

// Get current user profile
userRoutes.get('/me', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await userRepository.findOne({ where: { id: req.userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      height: user.height,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      weightUnit: user.weightUnit,
      heightUnit: user.heightUnit,
      energyUnit: user.energyUnit,
      profilePhotoUrl: user.profilePhotoUrl,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update user profile
userRoutes.put('/me', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { fullName, height, dateOfBirth, gender, weightUnit, heightUnit, energyUnit } = req.body;

    const user = await userRepository.findOne({ where: { id: req.userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (fullName) user.fullName = fullName;
    if (height !== undefined) user.height = height;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;
    if (gender) user.gender = gender;
    if (weightUnit) user.weightUnit = weightUnit;
    if (heightUnit) user.heightUnit = heightUnit;
    if (energyUnit) user.energyUnit = energyUnit;

    await userRepository.save(user);

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        height: user.height,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        weightUnit: user.weightUnit,
        heightUnit: user.heightUnit,
        energyUnit: user.energyUnit,
      },
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});
