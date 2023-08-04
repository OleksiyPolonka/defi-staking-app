import { useRef } from "react";
import tether from "../tether.png";
import Airdrop from "./Airdrop";

const Main = ({
  rwdBalance,
  stakeTokens,
  unstakeTokens,
  tetherBalance,
  stakingBalance,
  decentralBankContract,
}) => {
  const inputRef = useRef(null);
  return (
    <div id="content" className="mt-3">
      <table className="table text-muted text-center">
        <thead>
          <tr style={{ color: "white" }}>
            <th scope="col">Staking Balance</th>
            <th scope="col">Reward Balance</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ color: "white" }}>
            <td>{window.web3.utils.fromWei(stakingBalance, "ether")} USDT</td>
            <td>{window.web3.utils.fromWei(rwdBalance, "ether")} RWD</td>
          </tr>
        </tbody>
      </table>
      <div className="card mb-2" style={{ opacity: ".9" }}>
        <form
          onSubmit={(event) => {
            event.preventDefault();

            const amount = window.web3.utils.toWei(
              inputRef.current.value,
              "ether"
            );
            stakeTokens(amount);
          }}
          className="mb-3 "
        >
          <div style={{ borderSpacing: "0 1em" }}>
            <label className="float-left" style={{ marginLeft: "15px" }}>
              <b>Stake Tokens</b>
            </label>
            <span className="float-right" style={{ marginRight: "8px" }}>
              Balance: {window.web3.utils.fromWei(tetherBalance, "ether")}
            </span>
            <div className="input-group mb-4">
              <input type="text" ref={inputRef} placeholder="0" required />
              <div className="input-group-open">
                <div className="input-group-text">
                  <img src={tether} alt="tether" height="32" />
                  &nbsp;&nbsp;&nbsp; USDT
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-lg btn-block">
              DEPOSIT
            </button>
          </div>
        </form>
        <button
          type="submit"
          onClick={(event) => {
            event.preventDefault(unstakeTokens());
          }}
          className="btn btn-primary btn-lg btn-block"
        >
          WITHDRAW
        </button>
        <div className="card-body text-center" style={{ color: "blue" }}>
          AIRDROP
          {
            <Airdrop
              stakingBalance={stakingBalance}
              decentralBankContract={decentralBankContract}
            />
          }
        </div>
      </div>
    </div>
  );
};

export default Main;
