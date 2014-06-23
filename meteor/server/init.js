Meteor.startup(function () {

        if ((process.env.NODE_ENV || "production") == "production") {
            // production
            // Kadira.connect('xxx', 'yyy')
        } else {
            // development
        }


    }
)
