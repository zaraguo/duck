const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

exports.main = async (event, context) => {
  try {
    const {
      taskId, quantity, remarks, userId
    } = event.data;

    let {OPENID} = cloud.getWXContext();

    const data = await db.collection('check_in_record').add({
      data: {
        task_id: taskId, check_in_time: new Date(), remarks, quantity, user_id: OPENID
      }
    });
    return {
      success: true,
      data: data?._id
    }
  } catch (e) {
    return {
      success: false,
      data: e.message
    }
  }
};
