require("dotenv").config();

const oracledb = require("oracledb");

async function conectarOracle() {
  const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_SID } = process.env;

  return oracledb.getConnection({
    user: DB_USER,
    password: DB_PASSWORD,
    connectString: `(DESCRIPTION=
      (ADDRESS=(PROTOCOL=TCP)(HOST=${DB_HOST})(PORT=${DB_PORT}))
      (CONNECT_DATA=(SID=${DB_SID})))`,
  });
}

module.exports = { conectarOracle };