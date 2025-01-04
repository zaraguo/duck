const cloud = require('wx-server-sdk');
cloud.init({env: cloud.DYNAMIC_CURRENT_ENV});

const db = cloud.database();

exports.main = async (event, context) => {
  let {OPENID} = cloud.getWXContext();

  const query = {};
  if (event.data.id) {
    query._id = event.data.id;
  }
  const result = await db.collection('task')
    .where(query)
    .skip(0)
    .limit(100)
    .get();
  return {
    tasks: result?.data,
  };
};
