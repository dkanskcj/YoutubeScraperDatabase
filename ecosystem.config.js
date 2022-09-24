module.exports = {
	apps: [
		{
			name: 'youtube-scraper-backend',
			script: './dist/main.js',
			instances: 1,
			exec_mode: 'cluster',
			wait_ready: true,
			kill_timeout: 5000,
			env: {
				NODE_ENV: 'production',
			},
		},
	],
};
