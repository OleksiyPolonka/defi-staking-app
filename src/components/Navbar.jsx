import logo from "../bank.png";

const Navbar = ({ account }) => (
  <nav
    className="navbar navbar-dark fixed-top shadow p-0"
    style={{
      height: "50px",
      background: "black",
    }}
  >
    <a
      href="/"
      style={{ color: "white" }}
      className="navbar-brand col-sm-3 col-md-2 mr-0"
    >
      <img
        alt="logo"
        src={logo}
        width={50}
        height={30}
        className="d-inline-block align-top"
      />
      DAPP yield Farming
    </a>
    <ul className="navbar-nav px-3">
      <li className="text-nowrap ">
        <small style={{ color: "white" }}>Account Number: {account}</small>
      </li>
    </ul>
  </nav>
);

export default Navbar;
