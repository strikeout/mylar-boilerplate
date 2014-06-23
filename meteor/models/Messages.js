/* rID: room id,
 roomprinc
 message,
 userID: id of user sender,
 username: username of sender,
 time: time when message was sent
 */
Messages = new Meteor.Collection('messages');


Messages._encrypted_fields({ 'message': {princ: 'roomprinc', princtype: 'room', auth: ['_id']}});
Messages._immutable({roomprinc: ['rID', 'roomTitle', '_id']});


// ACL


if (Meteor.isServer) {
    Messages.allow({
        // can only insert a message in a room if you have access to the room
        insert: function (userId, doc) {
            var room = Rooms.findOne({_id: doc.rID});
            return room.createdByID == userId || _.contains(room.invitedID, userId);
        },

        // no one can update messages here
        update: function (userId, doc, fields, modifier) {
            return false;
        },

        // no one can delete messages
        remove: function (userId, doc) {
            return false;
        }
    });
}
