const dashbot = require('dashbot')('InENoVropQFLtrgVNyqXQssGaat4RgjpLV38ElQH').webchat

export const logIncoming = (messageForDashbot) => dashbot.logIncoming(messageForDashbot)
export const logOutgoing = (messageForDashbot) => dashbot.logOutgoing(messageForDashbot)

// const messageForDashbot = {
//   "text": userType,
//   "userId": userId,
//   "platformJson": {
//     "messageType": messageType,
//     "message": message
//   }
// };
