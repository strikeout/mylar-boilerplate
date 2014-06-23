if node[:opsworks][:instance][:instance_type] == "t1.micro"
	bash 'set_swap' do
		code <<-EOH
			sudo /bin/dd if=/dev/zero of=/var/swap.1 bs=1M count=1024
			sudo /sbin/mkswap /var/swap.1
			sudo /sbin/swapon /var/swap.1
			sudo echo "/var/swap.1 swap swap defaults 0 0" >> /etc/fstab
		EOH
		not_if 'grep -q "/var/swap.1 swap swap defaults 0 0" /etc/fstab'
	end
end