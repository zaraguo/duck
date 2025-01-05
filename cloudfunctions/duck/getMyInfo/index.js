const cloud = require('wx-server-sdk');
cloud.init({env: cloud.DYNAMIC_CURRENT_ENV});

const db = cloud.database();

exports.main = async (event, context) => {
  let {OPENID} = cloud.getWXContext();

  const result = await db.collection('user')
    .where({
      open_id: OPENID
    })
    .skip(0)
    .limit(1)
    .get();
  return result?.data?.[0];
};
