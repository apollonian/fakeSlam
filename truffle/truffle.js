var HDWalletProvider = require('truffle-hdwallet-provider');

var mnemonic = 'come eye busy museum magnet long venue cash trend kitchen voice ugly';

module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*' // Match any network id
    },
    ropsten: {
      provider: new HDWalletProvider(mnemonic, 'https://ropsten.infura.io/qC8vHEIJuuyDTTCKXf2m'),
      network_id: 3
    }
  }
};
