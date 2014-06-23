// use IDP only if active attacker
Accounts.config({sendVerificationEmail: active_attacker()});
// IDP:
var idp_pub = '8a7fe03431b5fc2db3923a2ab6d1a5ddf35cd64aea35e743' +
    'ded7655f0dc7e085858eeec06e1c7da58c509d57da56dbe6';
idp_init("http://localhost:3000", idp_pub, false);


Accounts.onCreateUser(function (options, user) {
    user.Room = {"inRoom": false, "inRoomID": "", "inRoomTitle": ""};
    user.Online = true;
    // We still want the default hook's 'profile' behavior.
    if (options.profile) user.profile = options.profile;
    return user;
});


Meteor._onLogin = function (userId) {
    console.log('[u]+ ' + userId + " logged in.")
}
Meteor._onLogout = function (userId) {
    console.log('[u]- ' + userId + " logged out.")
}