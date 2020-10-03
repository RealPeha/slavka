const FtpDeploy = require('ftp-deploy')

require('dotenv').config()

const ftpDeploy = new FtpDeploy()
 
const config = {
    user: process.env.FTP_USER,
    password: process.env.FTP_PASSWORD,
    host: process.env.FTP_HOST,
    port: process.env.FTP_PORT,
    localRoot: __dirname + '/public',
    remoteRoot: '/',
    include: ['*.*', '**/*'],
}
 
ftpDeploy
    .deploy(config)
    .then(res => console.log('finished:', res))
    .catch(err => console.log(err))