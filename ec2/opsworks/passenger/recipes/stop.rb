node[:deploy].each do |application, deploy|

  meteor_stop do
    deploy_data deploy
    app application
    app_config node[:meteor_app]
  end

end
