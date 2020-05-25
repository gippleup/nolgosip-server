module.exports = async (req, res, userJSON) => {
  const { db } = res;
  const { vacationId } = req.body;
  const { auth } = userJSON;

  if (!vacationId) return res.endWithMessage(400, 'VACATION ID REQUIRED');

  const targetVacation = await db.vacations.findOne({ where: { id: vacationId } });
  const vacationJSON = targetVacation.toJSON();

  if (userJSON.id === vacationJSON.userId) {
    targetVacation.status = 'cancelled';
    await targetVacation.save();
    return res.json(targetVacation);
  }

  if (userJSON.id !== vacationJSON.userId) {
    if (auth !== 'admin' && auth !== 'manager') return res.endWithMessage(400, 'UNAUTHORIZED REQUEST');
    targetVacation.status = 'declined';
    await targetVacation.save();
    return res.json(targetVacation);
  }
};
