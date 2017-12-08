var HDWalletProvider = require('truffle-hdwallet-provider');

var mnemonic = 'garment slide arrive explain ask parent limb taste popular chase make dismiss';

module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*' // Match any network id
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic, 'https://ropsten.infura.io/qC8vHEIJuuyDTTCKXf2m');
      },
      gas: 4612388,
      network_id: 3
    }
  }
};
