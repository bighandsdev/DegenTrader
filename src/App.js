import React from "react";
import logo from "./logo.png";
import "./App.css";
import CustomizedTables from "./components/CustomizedTables.js";
import Cards from "./components/Cards.js";
import SearchBar from "./components/SearchBar.js";
import Chart from "./components/Chart.js";
import CurrencySettings from "./components/CurrencySettings.js";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      searchOn: false,
      value: "",
      isLoaded: false,
      coins: [],
      coinsForCard: [],
      rawCoins: [],
      currencies: [
        "usd",
        "eur",
        "rub",
        "idr",
        "krw",
        "cny",
        "gbp",
        "aud",
        "cad",
      ],
      currencySymbols: {
        USD: "$", // US Dollar
        EUR: "€", // Euro
        CRC: "₡", // Costa Rican Colón
        GBP: "£", // British Pound Sterling
        ILS: "₪", // Israeli New Sheqel
        INR: "₹", // Indian Rupee
        JPY: "¥", // Japanese Yen
        KRW: "₩", // South Korean Won
        NGN: "₦", // Nigerian Naira
        PHP: "₱", // Philippine Peso
        PLN: "zł", // Polish Zloty
        PYG: "₲", // Paraguayan Guarani
        THB: "฿", // Thai Baht
        AUD: "$",
        CAD: "$",
      },
      currency: "usd",
      currencySymbol: "$",
    };
    this.onChange = this.onChange.bind(this);
    this.handleCurrencyClick = this.handleCurrencyClick.bind(this);
  }

  componentDidMount() {
    const currencyR = this.state.currency;
    fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currencyR}&order=market_cap_desc&per_page=100&page=1&sparkline=false`
    )
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            coins: result,
            rawCoins: result,
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          });
        }
      );
  }
  updateData(currency) {
    const currencyR = currency;
    fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currencyR}&order=market_cap_desc&per_page=100&page=1&sparkline=false`
    )
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            coins: result,
            rawCoins: result,
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          });
        }
      );
  }

  onChange(e) {
    this.setState({
      value: e.target.value,
    });
    if (e.target.value == "") {
      this.setState({
        coins: this.state.rawCoins,
      });
    } else if (e.target.value !== "") {
      {
        let searcjQery = e.target.value.toLowerCase(),
          displayedCoins = this.state.coins.filter((el) => {
            let searchValue = el.id.toLowerCase();
            return searchValue.indexOf(searcjQery) !== -1;
          });
        this.setState({
          coins: displayedCoins,
        });
      }
    }
  }
  manageCards(coins) {
    const coinOrderByPrice = coins.sort(
      (a, b) =>
        parseFloat(a.price_change_percentage_24h) -
        parseFloat(b.price_change_percentage_24h)
    );
    const coinOrderByPriceTop4 = coinOrderByPrice.splice(0, 4);
    return coinOrderByPriceTop4;
  }

  handleCurrencyClick(e) {
    this.setState({
      currency: e.currentTarget.getAttribute("data-item"),
    });
    return this.updateData(e.currentTarget.getAttribute("data-item"));
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div class="row">
            <img src={logo} className="logo" />
          </div>

          <Cards
            currency={this.state.currency}
            currency_symbols={this.state.currencySymbols}
          />
          <div style={{ width: 500 }}></div>

          <div>
            <SearchBar inputValue={this.state.value} onChange={this.onChange} />
            <span>
              <CurrencySettings
                currencies={this.state.currencies}
                onClick={this.handleCurrencyClick}
                inputValue={this.state.currency}
              />
            </span>
          </div>

          <div>
            <CustomizedTables
              coins={this.state}
              currency={this.state.currency}
              currency_symbols={this.state.currencySymbols}
            />
          </div>

          <div></div>
        </header>
      </div>
    );
  }
}

export default App;
