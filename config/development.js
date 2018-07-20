module.exports = {
  db: {
    host: 'localhost',
    port: 5432,
    database: 'blog',
    username: 'sweet',
    password: '123456yy',
    dialect: 'postgres'
  },
  redis: {
    host: 'localhost',
    port: 6379,
    socket_keepalive: true,
    db: 0
  }
}
