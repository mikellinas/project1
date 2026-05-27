const { validationResult } = require('express-validator');
const prisma = require('../lib/prisma');

const userSelect = {
  id: true,
  email: true,
  name: true,
  role: true,
  createdAt: true,
  updatedAt: true,
};

async function getAll(req, res, next) {
  try {
    const users = await prisma.user.findMany({ select: userSelect });
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: userSelect,
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (req.user.userId !== req.params.id) {
      return res.status(403).json({ message: 'You can only update your own account' });
    }

    const { email, name } = req.body;

    const existing = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ message: 'User not found' });

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { email, name: name ?? null },
      select: userSelect,
    });

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

async function patch(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (req.user.userId !== req.params.id) {
      return res.status(403).json({ message: 'You can only update your own account' });
    }

    const existing = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ message: 'User not found' });

    const data = {};
    if (req.body.email !== undefined) data.email = req.body.email;
    if (req.body.name !== undefined) data.name = req.body.name;

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data,
      select: userSelect,
    });

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    if (req.user.userId !== req.params.id) {
      return res.status(403).json({ message: 'You can only delete your own account' });
    }

    const existing = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ message: 'User not found' });

    await prisma.user.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getById, update, patch, remove };
