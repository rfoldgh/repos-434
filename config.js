

exports.DATABASE_URL = process.env.DATABASE_URL ||
//in a real world setting you’d have that set to a local variable, but assuming this is just a learning project, that should work
                      global.DATABASE_URL ||
                      (process.env.NODE_ENV === 'production' ?
                             'mongodb://localhost/lego-builder' :
                             'mongodb://localhost/lego-builder-dev');
exports.PORT = process.env.PORT || 8080;
