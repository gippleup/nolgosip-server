module.exports = async (req, res, curUser) => {
  const { db } = res;
  const { companyId } = req.body;

  // eslint-disable-next-line no-param-reassign
  curUser.companyId = companyId;
  await curUser.save();

  return res.json(curUser);
}