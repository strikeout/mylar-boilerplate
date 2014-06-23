define :meteor_stop do

	application = params[:app]
	deploy = params[:deploy_data]
	app_config = params[:app_config]

	deploy = node[:deploy][application]

	release_path = deploy[:deploy_to] + "/current"
    pid_file = deploy[:deploy_to] + "/shared/pids/passenger.pid"

	execute "Passenger STOP" do
		cwd release_path
		# igonore exit code with "||:"
		command "passenger stop --pid-file #{pid_file} ||:"
	end

end
