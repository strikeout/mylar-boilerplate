Meteor.methods({
    UpdateUserRoomInfoToInside: function (roomID, roomTitle) {
        var roomCreator = Rooms.findOne({_id: roomID}).createdByID;
        roomCreator = Meteor.users.findOne({_id: roomCreator}).username;
        Meteor.users.update({ _id: Meteor.userId() },
            { $set: { Room: {"inRoom": true, "inRoomID": roomID, "inRoomTitle": roomTitle,
                "inRoomCreator": roomCreator} } });
        Rooms.update({_id: roomID}, {$push: {peopleID: Meteor.userId(), peopleUsername: Meteor.user().username}});
    },
    UpdateUserRoomInfoToOutside: function (roomID) {
        Meteor.users.update({ _id: Meteor.userId() }, { $set: { Room: {"inRoomID": '', "inRoomTitle": '', "inRoom": false} } });
        Rooms.update({_id: roomID}, {$pull: { peopleID: Meteor.userId(), peopleUsername: Meteor.user().username }});
    },
    DeleteRoom: function (roomID) {
        Rooms.remove({_id: roomID});
        Messages.remove({rID: roomID});
    },
    UpdateOnlineFalse: function () {
        Meteor.users.update({ _id: Meteor.userId() }, { $set: { Online: false } });
    },
    UpdateOnlineTrue: function () {
        Meteor.users.update({ _id: Meteor.userId() }, { $set: { Online: true } });
    }
});
