const { before } = require("node:test");

const RWD = artifacts.require("RWD");
const Tether = artifacts.require("Tether");
const DecentralBank = artifacts.require("DecentralBank");

require("chai").use(require("chai-as-promised")).should();

contract("DecentralBank", ([owner, customer]) => {
  let tether, rwd, decentralBank;

  const getTokens = (number) => web3.utils.toWei(number, "ether");

  beforeEach(async () => {
    tether = await Tether.new();
    rwd = await RWD.new();
    decentralBank = await DecentralBank.new(rwd.address, tether.address);

    await rwd.transfer(decentralBank.address, getTokens("1000000"));
    await tether.transfer(customer, getTokens("100"), { from: owner });
  });

  describe("Tether Deployment", async () => {
    it("should match name successfully", async () => {
      const name = await tether.name();

      assert.equal(name, "Tether");
    });
  });

  describe("RWD Deployment", async () => {
    it("should match name successfully", async () => {
      const name = await rwd.name();

      assert.equal(name, "Reward Token");
    });
  });

  describe("Decentrial Bank Deployment", async () => {
    it("should match name successfully", async () => {
      const name = await decentralBank.name();

      assert.equal(name, "Decentral Bank");
    });
    it("contract has tokens", async () => {
      const balance = await rwd.balanceOf(decentralBank.address);
      console.log("balance", balance.toString());

      assert.equal(balance, getTokens("1000000"));
    });

    it("rewards tokens for staking", async () => {
      let results = await tether.balanceOf(customer);

      assert.equal(results.toString(), getTokens("100"));

      await tether.approve(decentralBank.address, getTokens("200"), {
        from: owner,
      });
      await decentralBank.depositTokens(getTokens("100"), { from: customer });
      results = await tether.balanceOf(customer);

      assert.equal(results.toString(), getTokens("0"));

      results = await tether.balanceOf(decentralBank.address);

      assert.equal(results.toString(), getTokens("100"));

      await decentralBank.issueTokens({ from: owner });

      await decentralBank.issueTokens({ from: customer }).should.be.rejected;

      await decentralBank.unstakeTokens({ from: customer });

      results = await tether.balanceOf(customer);

      assert.equal(results.toString(), getTokens("100"));
    });
  });
});
