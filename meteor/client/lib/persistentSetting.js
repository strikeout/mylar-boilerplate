/**
 * Persistent Settings package @todo outsource into mrt package!
 *
 * Usage:
 *    meinSetting = new persistentSetting('mySetting', 'allgemeine_einstellungen', 'some default value', 1000)
 *    meinSetting.get();
 *    meinSetting.set('new value');
 *    console.log(meinSetting.get());
 *
 * @param name - of the property
 * @param namespace - container for the property
 * @param default_value
 * @param timeout - only save after timeout
 */
persistentSetting = function(name, namespace, default_value, timeout) {
    var self = this;

    self.name = name;
    self.namespace = namespace || 'client';
    self.default_value = default_value;
    self.timeout = timeout || 333;
    self.value = false;
    self.timeoutRef = false;
    self.dep = new Deps.Dependency();
    self.initialized = (self.default_value===null);

    Deps.autorun(function() {
        if (Meteor.user() && Meteor.user().profile && !self.initialized)  self.init();
    })

};

persistentSetting.prototype.init = function() {
    var self = this;

    // namespace not found, create in db

    var tmp;
    if (!_.isUndefined(Meteor.user().profile[self.namespace]) && !_.isUndefined(Meteor.user().profile[self.namespace][self.name])) {
        tmp = Meteor.user().profile[self.namespace][self.name]
    } else {
        tmp = self.default_value;
    }
    self.set(tmp);

    self.initialized = true;
    return this;
}

persistentSetting.prototype.get = function() {
    var self = this;
    this.dep.depend();


    // username shortcut
    if (!self.value && self.name == 'name') {
        return Meteor.user().profile.name
    }


//    if (self.value == "") delete self.value
    return self.value;
};

persistentSetting.prototype.set = function(value) {
    var self = this;
    self.value = value;

    // save after a delay, so we dont waste db queries on fast switches like on(slide)
    if (self.timeoutRef) {
//        NProgress.trickle()
        clearTimeout(self.timeoutRef)
    }
    Deps.autorun(function() {
        var x = Meteor.user()
        self.dep.changed();
        NProgress.done();

    })
    self.timeoutRef = setTimeout(function() {
//        NProgress.trickle();


        if (self.name == "name") // special for username, its attached w/o namespace
            var mongoPath = "profile.name";
        else
            var mongoPath = "profile." + self.namespace + "." + self.name;

        var payload = {}
        payload[mongoPath] = value;

        Meteor.users.update({_id: Meteor.userId()}, {$set: payload}, function(err) {
            if (err) console.log('err', err)
            console.log(mongoPath, " updated to:", value)
            self.dep.changed()
            NProgress.done();
        })

    }, self.timeout);

}


persistentSetting.prototype.createNamespace = function() {
    // create base-namespace if not defined already
    if (!_.isObject(Meteor.user().profile[this.namespace])) {
        Meteor.user().profile[this.namespace] = {}
    }
}

