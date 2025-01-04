const fetchTaskList = require('./fetchTaskList/index');
const fetchCheckInRecordList = require('./fetchCheckInRecordList/index');
const sumCheckInRecord = require('./sumCheckInRecord/index');
const checkIn = require('./checkIn/index');
const queryMemberList = require('./queryMemberList/index');

// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.type) {
    case 'fetchTaskList':
      return await fetchTaskList.main(event, context);
    case 'fetchCheckInRecordList':
      return await fetchCheckInRecordList.main(event, context);
    case 'sumCheckInRecord':
      return await sumCheckInRecord.main(event, context);
    case 'checkIn':
      return await checkIn.main(event, context);
    case 'queryMemberList':
      return await queryMemberList.main(event, context);
  }
};

