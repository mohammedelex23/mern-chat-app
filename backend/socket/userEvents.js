const socket = require("../server");
const {DELETED_USER} = require("./eventMessages");
module.exports = {
    deletedUser: function (user) {
        socket.emit(DELETED_USER, {id: userId})
    }
}

