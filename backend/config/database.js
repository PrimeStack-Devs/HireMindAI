// const path = require("path");

// module.exports = ({ env }) => {
//   // PRODUCTION (Railway)
//   if (env("NODE_ENV") === "production") {
//     return {
//       connection: {
//         client: "postgres",
//         connection: {
//           host: env("PGHOST"),
//           port: env.int("PGPORT"),
//           database: env("PGDATABASE"),
//           user: env("PGUSER"),
//           password: env("PGPASSWORD"),
//           ssl: { rejectUnauthorized: false },
//         },
//       },
//     };
//   }

//   // LOCAL DEVELOPMENT
//   return {
//     connection: {
//       client: "sqlite",
//       connection: {
//         filename: path.join(__dirname, "..", ".tmp", "data.db"),
//       },
//       useNullAsDefault: true,
//     },
//   };
// };
const path = require("path");

module.exports = ({ env }) => {
  return {
    connection: {
      client: "postgres",
      connection: {
        host: env("PGHOST", "127.0.0.1"),
        port: env.int("PGPORT", 24569),
        database: env("PGDATABASE", "strapi"),
        user: env("PGUSER", "strapi"),
        password: env("PGPASSWORD", "password"),
        // ssl: true,
      },
    },
  };
};