Template.logo.isConnected = function () {
    return Meteor.status().connected
}


/**
 *
 * {{displayName}}
 * @returns returns Username
 */
UI.registerHelper("displayName", function () {
    var user = Meteor.user();
    if (!user)
        return '';

    if (setting_name.get())
        return setting_name.get();
    if (user.username)
        return user.username;
    if (user.emails && user.emails[0] && user.emails[0].address)
        return user.emails[0].address;
    return '';
});


/**
 *
 * {{timeFromNow Date}}
 * @returns string timeFromNow moment.js formatted
 */
UI.registerHelper("timeFromNow", function (date) {
    var content = timeDifference(new Date(), new Date(date));
//    var content = moment(date).fromNow()
    return new Spacebars.SafeString(content);
});
function timeDifference(current, previous) {
    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;
    var elapsed = current - previous;
    if (elapsed < msPerMinute) return Math.round(elapsed / 1000) + ' seconds ago';
    else if (elapsed < msPerHour) return Math.round(elapsed / msPerMinute) + ' minutes ago';
    else if (elapsed < msPerDay) return Math.round(elapsed / msPerHour) + ' hours ago';
    else if (elapsed < msPerMonth) return '' + Math.round(elapsed / msPerDay) + ' days ago';
    else if (elapsed < msPerYear) return '' + Math.round(elapsed / msPerMonth) + ' months ago';
    else return '' + Math.round(elapsed / msPerYear) + ' years ago';
}

/**
 *
 * {{shorten "string" 8}}
 * @returns string sliced to number of chars
 */
UI.registerHelper("shorten", function(str, length) {
    if (!str) return "";
    if (str === Meteor.userId()) return 'me';
    if (str.length <= length) return str;

    var pre = Math.ceil(length / 1.2);
    var post = pre - length
    var content = str.slice(0, pre) + '..' + str.slice(post);
    return new Spacebars.SafeString(content);
});

/**
 *
 * {{formatNumber 0.0115 2}}
 * @returns string sliced to number of chars
 */
UI.registerHelper("formatNumber", function(number, decimals) {
    if (!_.isNumber(number) || isNaN(number)) return (0).toFixed(decimals)
    var content = number.toFixed(decimals);
    return new Spacebars.SafeString(content);
});
