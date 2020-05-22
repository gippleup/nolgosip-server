module.exports = async (req, res, userJSON) => {
  const { db } = res;
  const { vacationId } = req.body;
  const { auth } = userJSON;

  if (!vacationId) return res.end('VACATION ID REQUIRED');

  const targetVacation = await db.vacations.findOne({ where: { id: vacationId } });
  const vacationJSON = targetVacation.toJSON();
  if (!vacationJSON) return res.end('NO SUCH VACATION');

  if (auth !== 'admin' && auth !== 'manager') return res.end('UNAUTHORIZED REQUEST');
  targetVacation.status = 'waiting';
  await targetVacation.save();
  return res.json(targetVacation);
};
