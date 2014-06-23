/*  roomTitle
 peopleID
 peopleUsername: creator username
 invitedID : list of ids of users invited to this room
 createdByID: user id creator
 */
Rooms = new Meteor.Collection('rooms');


var search_loaded = false;

// PUB
if (Meteor.isServer) {
    Meteor.publish("rooms", function () {
        return Rooms.find({$or: [
            {invitedID: this.userId},
            {createdByID: this.userId}
        ] });
    });
    Meteor.publish("messages", function (roomID) {
        return Messages.find({rID: roomID});
    });

    if (search_loaded) {
        filter = function (userID) {
            // create a list of all the rooms this user has access to
            var rooms = Rooms.find({$or: [
                {createdByID: userID},
                {invitedID: userID}
            ]
            }).fetch();
            var filters = [];
            _.each(rooms, function (room) {
                filters.push({rID: room._id});
            });

            return filters;
        };
        Messages.publish_search_filter("search-messages-of-userid", filter);
    }
}

// SUB
if (Meteor.isClient) {
    Deps.autorun(function () {
        Meteor.subscribe("rooms");
    });
}


// ACL
if (Meteor.isServer) {
    Rooms.allow({
        // anyone can insert a new room
        insert: function (userId, doc) {
            return true;
        },
        // only owner can change room
        update: function (userId, doc, fields, modifier) {
            return doc.createdByID === userId;
        },
        // only owner can remove room
        remove: function (userId, doc) {
            return doc.createdByID === userId;
        }
    });
}

