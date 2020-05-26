const utils = require('../utils');

module.exports = async (req, res) => {
  const { db } = res;
  const auth = await utils.jwt.verify(req.session.auth, (err, decoded) => {
    if (err) return false;
    return decoded.data;
  });
  if (!auth || auth !== 'admin') return res.endWithMessage(400, 'UNAUTHORIZED REQUEST');

  const usedVacationQuery = `
    SELECT
      U.name as userName, U.email as userEmail, V.id as vacationId, V.from, V.to, V.status
    FROM
      users as U
    INNER JOIN
      vacations as V on V.userId=U.id
    WHERE
      V.status='complete' OR V.status='waiting' OR V.status='approved'
  `;

  const usedVacations = await new Promise((resolve, reject) => {
    db.mysql.query(usedVacationQuery, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });

  const usedForEach = {};

  usedVacations.forEach((row) => {
    usedForEach[row.userEmail] = {
      used: [],
      approved: [],
      waiting: [],
      sum: {
        used: 0,
        approved: 0,
        waiting: 0,
      },
    };
  });

  const targetVacationData = ['vacationId', 'from', 'to', 'status', 'span'];
  const filteredRow = (row) => utils.objInclude(row, targetVacationData);
  const diffInDay = (row) => {
    const dateDiff = Date.parse(row.to) - Date.parse(row.from);
    const result = dateDiff / 1000 / 60 / 60 / 24;
    return result;
  };

  usedVacations.forEach((row) => {
    const {
      used,
      approved,
      waiting,
      sum,
    } = usedForEach[row.userEmail];

    Object.assign(row, {
      span: diffInDay(row),
    });

    if (row.status === 'complete') {
      used.push(filteredRow(row));
      sum.used += row.span;
    }
    if (row.status === 'approved') {
      approved.push(filteredRow(row));
      sum.approved += row.span;
    }
    if (row.status === 'waiting') {
      waiting.push(filteredRow(row));
      sum.waiting += row.span;
    }
  });

  console.log(usedForEach);

  const query = `
  SELECT 
    G.name as groupName, 
    G.managerId, 
    G.id as groupId, 
    U.name as userName, 
    U.auth, 
    U.email, 
    U.mobile,
    U.totalVacation
  FROM 
    users AS U
  LEFT JOIN 
    groups AS G 
      ON G.id = U.groupId;
  `;

  const users = await new Promise((resolve, reject) => {
    db.mysql.query(query, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });

  const userWithVacation = users.map((user) => {
    const newData = user;
    newData.vacations = usedForEach[user.email];
    return user;
  });

  return res.json(userWithVacation);
};
