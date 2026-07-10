import { Router, Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { JournalEntry } from '../entities/JournalEntry';
import { authMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware';

export const journalRoutes = Router();
const journalRepository = AppDataSource.getRepository(JournalEntry);

journalRoutes.use(authMiddleware);

journalRoutes.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { startDate, endDate, tags, limit = 50 } = req.query;
    let query = journalRepository
      .createQueryBuilder('journal')
      .where('journal.userId = :userId', { userId: req.userId })
      .orderBy('journal.date', 'DESC');

    if (startDate) query = query.andWhere('journal.date >= :startDate', { startDate });
    if (endDate) query = query.andWhere('journal.date <= :endDate', { endDate });
    if (tags) query = query.andWhere('journal.tags LIKE :tags', { tags: `%${tags}%` });

    const entries = await query.limit(Number(limit)).getMany();
    res.json({ count: entries.length, data: entries });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch journal entries' });
  }
});

journalRoutes.get('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const entry = await journalRepository.findOne({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!entry) return res.status(404).json({ error: 'Journal entry not found' });

    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch journal entry' });
  }
});

journalRoutes.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, content, date, tags, moodRating } = req.body;

    if (!content || !date) {
      return res.status(400).json({ error: 'content and date are required' });
    }

    const entry = journalRepository.create({
      userId: req.userId,
      title: title || null,
      content,
      date,
      tags: tags || null,
      moodRating: moodRating || null,
    });

    await journalRepository.save(entry);
    res.status(201).json({ message: 'Journal entry created', data: entry });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create journal entry' });
  }
});

journalRoutes.put('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const entry = await journalRepository.findOne({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!entry) return res.status(404).json({ error: 'Journal entry not found' });

    const { title, content, date, tags, moodRating } = req.body;
    if (title !== undefined) entry.title = title;
    if (content) entry.content = content;
    if (date) entry.date = date;
    if (tags !== undefined) entry.tags = tags;
    if (moodRating !== undefined) entry.moodRating = moodRating;
    entry.updatedAt = new Date();

    await journalRepository.save(entry);
    res.json({ message: 'Journal entry updated', data: entry });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update journal entry' });
  }
});

journalRoutes.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const entry = await journalRepository.findOne({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!entry) return res.status(404).json({ error: 'Journal entry not found' });

    await journalRepository.remove(entry);
    res.json({ message: 'Journal entry deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete journal entry' });
  }
});
