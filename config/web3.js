import Web3 from 'web3';
import ethers from 'ethers';
import Accounts from 'web3-eth-accounts';
const network = ethers.providers
const web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/'+process.env.BNP_INFURA_KEY));

export default web3