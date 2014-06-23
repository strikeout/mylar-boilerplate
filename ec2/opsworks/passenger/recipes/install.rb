#
# Cookbook Name:: passenger
# Recipe:: install

gem_package "passenger" do
  package_name 'passenger'
end

include_recipe 'phantomjs::default'

node[:deploy].each do |application, deploy|

  meteor_install do
    deploy_data deploy
    app application
    app_config node[:meteor_app]
  end

end
