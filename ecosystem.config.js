/** @format */

module.exports = [
    {
        script: './build/main.js',
        name: 'mocr-server',
        exec_mode: 'cluster',
        instances: "1",
        restart_delay: 4000,
        max_memory_restart: '15G',
        env: {
            NODE_ENV: 'production',
        },
    },
];
