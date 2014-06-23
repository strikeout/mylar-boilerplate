define :meteor_install do

	application = params[:app]
	deploy = params[:deploy_data]
	app_config = params[:app_config]

	deploy = node[:deploy][application]

    release_path = deploy[:deploy_to] + "/current"

end
