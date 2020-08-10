import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import "./Cards.css";

export default class CustomizedTables extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      coins: [],
      currency: this.props.currency,
      currency_symbols: this.props.currency_symbols,
    };
  }

  componentDidMount() {
    fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${this.state.currency}&order=market_cap_desc&per_page=100&page=1&sparkline=false`
    )
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            coins: this.manageCards(result),
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
  handleUporDown(coinChange) {
    if (coinChange > 0) {
      return "Card-up";
    } else {
      return "Card-down";
    }
  }
  roundDown(number, decimals) {
    decimals = decimals || 0;
    return Math.floor(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }
  handleEmoji(coinChange) {
    if (coinChange < -10) {
      return <span>💀</span>;
    } else if (coinChange < 0) {
      return <span>😕</span>;
    } else if (coinChange < 10) {
      return <span>😃</span>;
    } else if (coinChange < 20) {
      return <span>🚀</span>;
    } else if (coinChange > 20) {
      return <span>🤯</span>;
    }
  }
  manageCards(coins) {
    const coinOrderByPrice = coins.sort(
      (a, b) =>
        parseFloat(b.price_change_percentage_24h) -
        parseFloat(a.price_change_percentage_24h)
    );
    const coinOrderByPriceTop4 = coinOrderByPrice.splice(0, 4);
    return coinOrderByPriceTop4;
  }

  render() {
    const { error, isLoaded, coins } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div class="row">
          <div class="column">
            {coins.map((coin) => (
              <div
                class={this.handleUporDown(coin.price_change_percentage_24h)}
              >
                <p className="card-text">
                  <img className="image" src={coin.image} />
                  {coin.id.charAt(0).toUpperCase() + coin.id.slice(1)}{" "}
                  {this.handleEmoji(coin.price_change_percentage_24h)}
                </p>

                <p className="card-price">
                  {
                    this.state.currency_symbols[
                      this.state.currency.toUpperCase()
                    ]
                  }
                  {coin.current_price}{" "}
                </p>
                <p className="card-price-change">
                  {this.roundDown(coin.price_change_percentage_24h, 2)} %
                </p>
              </div>
            ))}
          </div>
        </div>
      );
    }
  }
}
