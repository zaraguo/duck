const cloud = require('wx-server-sdk');
cloud.init({env: cloud.DYNAMIC_CURRENT_ENV});

const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  const query = {};
  if (event.data?.openIds?.length) {
    query.open_id = _.in(event.data.openIds);
  }

  const result = await db.collection('user')
    .where(query)
    .skip(0)
    .limit(100)
    .get();
  return {
    members: result?.data,
  };
};
