module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/dev-meetup/' : '/',
  transpileDependencies: ['vuetify']
};
