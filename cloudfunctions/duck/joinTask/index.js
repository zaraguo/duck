const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  try {
    const {
      taskId
    } = event.data;

    let {OPENID} = cloud.getWXContext();

    const result = await db.collection('task')
      .where({_id: taskId, members: OPENID})
      .get();

    const members = result?.data;
    if (!members?.length) {
      await db.collection('task').doc(taskId).update({
        data: {
          members: _.push(OPENID)
        }
      });
    }

    return {
      success: true,
    }
  } catch (e) {
    return {
      success: false,
      data: e.message
    }
  }
};
