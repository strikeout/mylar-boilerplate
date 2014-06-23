// PUB
if (Meteor.isServer) {
    Meteor.publish("users", function () {
        return Meteor.users.find({}, {fields: {}});
    });
}
// SUB
if (Meteor.isClient) {
    Deps.autorun(function () {
        Meteor.subscribe("users");
    });
}

