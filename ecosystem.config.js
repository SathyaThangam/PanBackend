module.exports = {
  apps : [{
    name: 'PancardFormNode',
    script: 'npm',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    args: 'one two',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],

  deploy : {
    production : {
      user : 'root',
      host : '159.89.165.174',
      ref  : 'origin/master', 
      repo : 'https://github.com/SathyaThangam/PancardFormNode.git',
      path : '/var/www/PancardFormNode',
      // 'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
      'post-deploy' : 'npm install --production && pm2 del PancardFormNode || npm run production'
      
    }
  }
};