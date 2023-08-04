import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Web3 from "web3";
import RWD from "./truffle_abis/RWD.json";
import Tether from "./truffle_abis/Tether.json";
import DecentralBank from "./truffle_abis/DecentralBank.json";

import "bootstrap/dist/css/bootstrap.min.css";
import Main from "./components/Main";

const App = () => {
  const [state, setState] = useState({
    rwd: {},
    tether: {},
    account: "0x0",
    loading: true,
    rwdBalance: "",
    tetherBalance: "",
    decentralBank: {},
    stakingBalance: "0",
  });

  const web3Init = async () => {
    try {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
      } else {
        // TODO
      }
    } catch {
      // TODO
    }
  };

  const stakeTokens = (amount) => {
    setState({ ...state, loading: true });
    state.tether.methods
      .approve(state.decentralBank._address, amount)
      .send({ from: state.account })
      .on("transactionHash", (hash) => {
        state.decentralBank.methods
          .depositTokens(amount)
          .send({ from: state.account })
          .on("transactionHash", () => {
            setState({ ...state, loading: false });
          });
      });
  };

  const unstakeTokens = () => {
    setState({ ...state, loading: true });
    state.decentralBank.methods
      .unstakeTokens()
      .send({ from: state.account })
      .on("transactionHash", () => {
        setState({ ...state, loading: false });
      });
  };

  const loadBlockChainData = async () => {
    const web3 = window.web3;
    const [accounts, networkId] = await Promise.all([
      web3.eth.getAccounts(),
      web3.eth.net.getId(),
    ]);
    const tetherData = Tether.networks[networkId];
    const rwdData = RWD.networks[networkId];
    const decentralBankData = DecentralBank.networks[networkId];

    const tether = new web3.eth.Contract(Tether.abi, tetherData.address);
    const rwd = new web3.eth.Contract(RWD.abi, rwdData.address);
    const decentralBank = new web3.eth.Contract(
      DecentralBank.abi,
      decentralBankData.address
    );

    const tetherBalance = await tether.methods.balanceOf(accounts[0]).call();
    const rwdBalance = await rwd.methods.balanceOf(accounts[0]).call();
    console.log("rwdBalance", rwdBalance);
    const stakingBalance = await decentralBank.methods
      .stakingBalance(accounts[0])
      .call();
    console.log("stakingBalance.toNumber()", stakingBalance);

    setState({
      ...state,
      rwd,
      tether,
      rwdBalance,
      tetherBalance,
      decentralBank,
      loading: false,
      stakingBalance,
      account: accounts[0],
    });
  };

  useEffect(() => {
    (async () => {
      await web3Init();
      await loadBlockChainData();
    })();
  }, []);

  return (
    <div>
      <Navbar account={state.account} />
      <div className="container-fluid mt-5">
        <div className="row">
          <main
            role="main"
            className="col-lg-12 ml-auto mr-auto"
            style={{ minHeight: "100vm", maxWidth: "600px" }}
          >
            <div>
              {state.loading ? (
                <p
                  id="loader"
                  className="text-center"
                  style={{ margin: "30px" }}
                >
                  LOADING PLEASE...
                </p>
              ) : (
                <Main
                  stakeTokens={stakeTokens}
                  unstakeTokens={unstakeTokens}
                  rwdBalance={state.rwdBalance}
                  tetherBalance={state.tetherBalance}
                  stakingBalance={state.stakingBalance}
                  decentralBankContract={state.decentralBank}
                />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;
