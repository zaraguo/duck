const cloud = require('wx-server-sdk');
cloud.init({env: cloud.DYNAMIC_CURRENT_ENV});

const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  const query = {
    task_id: event.data.taskId
  };
  // 查询指定日期内的签到记录, checkInDate 为查询日期的十三位时间戳
  if (event.data.checkInDate) {
    query.check_in_time = _.gt(new Date(event.data.checkInDate)).and(_.lt(new Date(event.data.checkInDate + 24 * 60 * 60 * 1000)));
  }
  const result = await db.collection('check_in_record')
    .where(query)
    .skip(0)
    .limit(100)
    .orderBy('check_in_time', 'desc')
    .get();

  return {
    records: result?.data,
  };
};
