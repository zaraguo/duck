const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
const _ = db.command;
const $ = _.aggregate;

exports.main = async (event, context) => {
  const query = {};
  if (event.data.taskId) {
    query.task_id = event.data.taskId;
  }
  if (event.data.userId) {
    query.user_id = event.data.userId;
  }
  // 查询指定日期内的签到记录, checkInDate 为查询日期的十三位时间戳
  if (event.data.checkInDate) {
    query.check_in_time = _.gt(new Date(event.data.checkInDate)).and(_.lt(new Date(event.data.checkInDate + 24 * 60 * 60 * 1000)));
  }

  return db.collection('check_in_record')
    .aggregate()
    .match(query)
    .group({
      _id: '$user_id',
      sum: $.sum('$quantity')
    })
    .end();
};
