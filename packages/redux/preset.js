const path = require('path');
module.exports = {
  mixins: [__dirname, path.join(__dirname, 'actionCreatorDispatcher')],
};
