import bcypher from 'blockcypher';
const bcapi = new bcypher('bcy',process.env.BNP_CYPHER_ENV,process.env.BNP_CYPHER_API_TOKEN);
export default bcapi
