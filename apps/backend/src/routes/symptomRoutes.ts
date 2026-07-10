import { Router, Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Symptom } from '../entities/Symptom';
import { authMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware';

export const symptomRoutes = Router();
const symptomRepository = AppDataSource.getRepository(Symptom);

symptomRoutes.use(authMiddleware);

symptomRoutes.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { startDate, endDate, category, limit = 50 } = req.query;
    let query = symptomRepository
      .createQueryBuilder('symptom')
      .where('symptom.userId = :userId', { userId: req.userId })
      .orderBy('symptom.date', 'DESC');

    if (startDate) query = query.andWhere('symptom.date >= :startDate', { startDate });
    if (endDate) query = query.andWhere('symptom.date <= :endDate', { endDate });
    if (category) query = query.andWhere('symptom.category = :category', { category });

    const symptoms = await query.limit(Number(limit)).getMany();
    res.json({ count: symptoms.length, data: symptoms });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch symptoms' });
  }
});

symptomRoutes.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { symptomName, severity, date, time, notes, category } = req.body;

    if (!symptomName || !date) {
      return res.status(400).json({ error: 'symptomName and date are required' });
    }

    const symptom = symptomRepository.create({
      userId: req.userId,
      symptomName,
      severity: severity || 3,
      date,
      time: time || new Date().toTimeString().slice(0, 8),
      notes: notes || null,
      category: category || null,
    });

    await symptomRepository.save(symptom);
    res.status(201).json({ message: 'Symptom logged', data: symptom });
  } catch (error) {
    res.status(500).json({ error: 'Failed to log symptom' });
  }
});

symptomRoutes.put('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const symptom = await symptomRepository.findOne({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!symptom) return res.status(404).json({ error: 'Symptom not found' });

    const { symptomName, severity, date, time, notes, category } = req.body;
    if (symptomName) symptom.symptomName = symptomName;
    if (severity !== undefined) symptom.severity = severity;
    if (date) symptom.date = date;
    if (time) symptom.time = time;
    if (notes !== undefined) symptom.notes = notes;
    if (category) symptom.category = category;

    await symptomRepository.save(symptom);
    res.json({ message: 'Symptom updated', data: symptom });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update symptom' });
  }
});

symptomRoutes.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const symptom = await symptomRepository.findOne({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!symptom) return res.status(404).json({ error: 'Symptom not found' });

    await symptomRepository.remove(symptom);
    res.json({ message: 'Symptom deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete symptom' });
  }
});
