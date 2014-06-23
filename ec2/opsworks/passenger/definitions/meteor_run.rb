define :meteor_run do

	application = params[:app]
	deploy = params[:deploy_data]
	app_config = params[:app_config]

	deploy = node[:deploy][application]

    port = 80
	username = deploy[:user]
	release_path = deploy[:deploy_to] + "/current"

	log_file = deploy[:deploy_to] + "/shared/log/passenger.log"
	pid_file = deploy[:deploy_to] + "/shared/pids/passenger.pid"


	# Using the first domain to create ROOT_URL for Meteor
	domain_name = deploy[:domains][0]
	# Using the second domain to create DDP_URL for Meteor Websockets
	domain_ws_name = deploy[:domains][1]

	if deploy[:ssl_support]
	  protocol_prefix = "https://"
	else
	  protocol_prefix = "http://"
	end

	environment = app_config[:environment]
	backends = node['opsworks']['instance']['backends']/2
	backends = backends.floor

	mongo_url = ""
	mongo_port = app_config[:mongo][:port]
	mongo_replica_layer = app_config[:mongo][:mongo_replica_layer]
	mongo_replica_options = app_config[:mongo][:mongo_replica_options]

	# find all instances in replica_layer, create mongo url
	replica_instances = []
	layer_instances = node[:opsworks][:layers][mongo_replica_layer]['instances']
	layer_instances.each do |name, instance|
	  replica_instances.push(instance['ip'])
	end

	replica_instance_string = replica_instances.join(',')
	replica_instance_string = replica_instance_string + ":" + mongo_port
	Chef::Log.info("DB LAYER: " + replica_instance_string)

	mongo_url = "mongodb://#{replica_instance_string}/#{application}?#{mongo_replica_options}"
	mongo_oplog_url = "mongodb://#{replica_instance_string}/local"

	Chef::Log.info("DB URL: " + mongo_url)
	Chef::Log.info("DB OPLOG URL: " + mongo_oplog_url)

	Chef::Log.info("PASSNGR #{release_path} >> passenger start --daemonize --user #{username} --environment #{environment} --port #{port} --log-file #{log_file} --pid-file #{pid_file} --app-type node --startup-file main.js --min-instances #{backends} --max-pool-size #{backends} --sticky-sessions")

    bash "Install NPM deps.." do
        user "root"
        code <<-EOH
            cd #{release_path}
            npm cache clean
            npm update
        EOH
    end

    env_file =  "/etc/profile.d/meteor_environment.sh"
	bash "Setting ENV vars for meteor deployment in #{env_file}" do
	  	user "root"
	  	code <<-EOH
              echo 'export ROOT_URL=#{protocol_prefix}#{domain_name}' > #{env_file}
              echo 'export ROOT_PORT=#{port}' >>  #{env_file}
              echo 'export DDP_DEFAULT_CONNECTION_URL="ddpi+sockjs://#{domain_ws_name}/sockjs"' >> #{env_file}
              echo 'export MONGO_URL="#{mongo_url}"' >> #{env_file}
              echo 'export MONGO_OPLOG_URL="#{mongo_oplog_url}"' >> #{env_file}
              source #{env_file}
        EOH
	end


	bash "Start Node App with PASSNGR in #{release_path}" do
	  	user "root"
	  	code <<-EOH
			export ROOT_URL="#{protocol_prefix}#{domain_name}"
			export PORT="#{port}"
			export DDP_DEFAULT_CONNECTION_URL="ddpi+sockjs://#{domain_ws_name}/sockjs"
			export MONGO_URL="#{mongo_url}"
			export MONGO_OPLOG_URL="#{mongo_oplog_url}"

			cd #{release_path}

            rm -rf programs/server/node_modules/fibers
			npm install fibers@1.0.1

            echo 'passenger start --daemonize --user "#{username}" --environment "#{environment}" --port "#{port}" --log-file #{log_file} --pid-file #{pid_file} --app-type node --startup-file main.js --min-instances "#{backends}" --max-pool-size "#{backends}" --sticky-sessions' > run.sh
			      passenger start --daemonize --user "#{username}" --environment "#{environment}" --port "#{port}" --log-file #{log_file} --pid-file #{pid_file} --app-type node --startup-file main.js --min-instances "#{backends}" --max-pool-size "#{backends}" --sticky-sessions
	  	EOH
	end

	ruby_block "change HOME back to /root after source checkout" do
		block do
		  	ENV['HOME'] = "/root"
		end
	end

	template "/etc/logrotate.d/opsworks_app_#{application}" do
		backup false
		source "logrotate.erb"
		cookbook 'deploy'
		owner "root"
		group "root"
		mode 0644
		variables( :log_dirs => ["#{deploy[:deploy_to]}/shared/log" ] )
	end

end
