bash 'set_locale' do
	code <<-EOH
		export LANGUAGE=en_US.UTF-8
		export LANG=en_US.UTF-8
		export LC_ALL=en_US.UTF-8
		sudo locale-gen en_US.UTF-8
		sudo dpkg-reconfigure locales
	EOH
end