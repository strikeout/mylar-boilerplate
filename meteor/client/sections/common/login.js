
Template.login.events({
    'submit form': function(event) {
        var e = event.currentTarget;
        var login = $(e).find('#email').val()
        var pass = $(e).find('#password').val()
        NProgress.start();
        Meteor.logout(function() {
            Meteor.loginWithPassword(login, pass, function() {
                Meteor.call('redirect_to_user_homepage');
            });
        });
        return false;
    },
    'click .login_facebook': function(event) {
        NProgress.start();
        Meteor.loginWithFacebook(function() {
            Meteor.call('redirect_to_user_homepage');
        });
        return false;
    }
})

Meteor.methods({
    redirect_to_user_homepage: function() {
        if (_.isObject(Meteor.user()) && _.isObject(Meteor.user().profile.settings) && _.isString(Meteor.user().profile.settings.homepage)) {
            var homepage = Meteor.user().profile.settings.homepage;
        } else {
            var homepage = 'home'
        }
        Router.go(homepage)
    }
})
