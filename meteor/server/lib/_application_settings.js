// get NODE_ENV or default to "development"
var env = process.env.NODE_ENV || "production"
var config_file = 'config_' + env + '.json'

// environment-specific settings
var env_conf = EJSON.parse(Assets.getText(config_file))

// other settings
var settings = EJSON.parse(Assets.getText("settings.json"))

console.log("[i] Starting.. ENV [", env, "] with config file ./private/" + config_file)

// merge multiple jsons to the final Meteor.settings object
Meteor.settings = _.extend(settings, env_conf)

// stolen from metor-core, client-side settings.public integration
if (Meteor.settings && Meteor.settings.public && typeof __meteor_runtime_config__ === "object") {
    __meteor_runtime_config__.PUBLIC_SETTINGS = Meteor.settings.public;
}
