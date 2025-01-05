const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

exports.main = async (event, context) => {
  try {
    const {name} = event.data;

    let {OPENID} = cloud.getWXContext();

    const data = await db.collection('user').add({
      data: {
        open_id: OPENID, name, register_time: new Date(),
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
