var FakeSlam = artifacts.require('./FakeSlam.sol');

module.exports = function(deployer) {
  deployer.deploy(FakeSlam);
};
