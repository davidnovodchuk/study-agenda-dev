'use strict';

// Production specific configuration
// =================================
module.exports = {
  seedDB: true,

  // Server IP
  ip:       process.env.OPENSHIFT_NODEJS_IP ||
            process.env.IP ||
            undefined,

  // Server port
  port:     process.env.OPENSHIFT_NODEJS_PORT ||
            process.env.PORT ||
            80,

  sslPort:  443,

  keyFile:  '/etc/letsencrypt/live/studyagenda.com/privkey.pem',
  certFile: '/etc/letsencrypt/live/studyagenda.com/cert.pem',
  // MongoDB connection options
  mongo: {
    uri:    process.env.MONGOLAB_URI ||
            process.env.MONGOHQ_URL ||
            process.env.OPENSHIFT_MONGODB_DB_URL+process.env.OPENSHIFT_APP_NAME ||
            'mongodb://localhost/studyAgenda'
  }
};
