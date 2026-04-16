const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/leave-management').then(async () => {
  const User = require('./models/User');
  const LeaveRequest = require('./models/LeaveRequest');
  const Notification = require('./models/Notification');
  
  await LeaveRequest.deleteMany({});
  await Notification.deleteMany({});
  await User.updateMany({}, { $set: { leaveBalance: 12 } });
  
  console.log('✅ Sab clean! Fresh start!');
  process.exit();
});