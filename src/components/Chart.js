import React, { useState, useEffect } from "react";
import { Line, Bar } from "react-chartjs-2";
import axios from "axios";
import moment from "moment";
import "./Chart.css";
import { withTheme } from "@material-ui/core";

const Chart = (props) => {
  const [chartData, setChartData] = useState({});
  const [chartVol, setChartVol] = useState({});
  const [id] = useState(props.id);
  const [currency] = useState(props.currency);
  const [symbol] = useState(props.currencysymbols);
  const [days] = useState(props.days);
  const [redraw, setRedraw] = useState({});
  const chart = (props) => {
    let daysChart = props.days;
    let currency = props.currency;
    let symbol = props.currencysymbols;
    let time = [];
    let price = [];
    let priceSmaller = [];
    let volume = [];
    let volumeSmaller = [];
    let timeSmaller = [];
    let timeSmallerAndConverted = [];
    let whichCoin = id;
    function roundDownPrice(number) {
      if (number >= 1) {
        const decimals = 2;
        const amount =
          Math.floor(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
        return amount.toFixed(2);
      } else if (number >= 0.01) {
        const decimals = 4;
        return (
          Math.floor(number * Math.pow(10, decimals)) /
          Math.pow(10, decimals).toFixed(4)
        );
      } else {
        const decimals = 7;
        return (
          Math.floor(number * Math.pow(10, decimals)) / Math.pow(10, decimals)
        );
      }
    }
    axios
      .get(
        `https://api.coingecko.com/api/v3/coins/${whichCoin}/market_chart?vs_currency=${currency}&days=${daysChart}`
      )
      .then((res) => {
        console.log(res);
        for (const dataObj of res.data.prices) {
          time.push(dataObj[0]);
          price.push(dataObj[1]);
        }
        console.log(price);

        for (var i = 0; i < price.length; i = i + 1) {
          priceSmaller.push(roundDownPrice(price[i]));
        }
        for (var i = 0; i < time.length; i++) {
          timeSmaller.push(time[i]);
        }
        for (var i = 0; i < timeSmaller.length; i++) {
          timeSmallerAndConverted.push(moment(timeSmaller[i]).format("ll"));
        }
        for (const dataObj of res.data.total_volumes) {
          time.push(dataObj[0]);
          volume.push(dataObj[1]);
        }
        console.log(volume);

        for (var i = 0; i < volume.length; i = i + 1) {
          volumeSmaller.push(volume[i]);
        }
        setChartData({
          labels: timeSmallerAndConverted,
          datasets: [
            {
              label: "Price",
              backgroundColor: "rgba(255, 99, 132, 0.5)",
              borderColor: "rgba(255, 99, 132, 0.5)",
              data: priceSmaller,
            },
          ],
        });
        setChartVol({
          labels: timeSmallerAndConverted,
          datasets: [
            {
              label: "Volume",
              backgroundColor: "rgba(135, 99, 225, 1)",
              borderColor: "rgba(135, 99, 225, 1)",
              data: volumeSmaller,
            },
          ],
        });

        setRedraw(true);
        setRedraw(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    chart(props);
  }, [props]);

  return (
    <div colspan="8">
      <td className="charts">
        <Line
          redraw={redraw}
          data={chartData}
          options={{
            legend: {
              display: false,
            },
            tooltips: {
              displayColors: false,
              mode: "x-axis",

              backgroundColor: "rgb(238, 221, 226)",
              bodyFontColor: "rgb(91, 38, 57)",
              titleFontColor: "rgb(91, 38, 57)",
              borderWidth: 1,
              borderColor: "rgb(226, 207, 213)",
              callbacks: {
                label: function (tooltipItems) {
                  return (
                    symbol +
                    tooltipItems.yLabel
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  );
                },
              },
            },
            responsive: true,
            title: { text: "THICCNESS SCALE", display: false },
            elements: {
              point: {
                radius: 0,
              },
              line: {
                tension: 0.05,
              },
            },
            scales: {
              yAxes: [
                {
                  ticks: {
                    autoSkip: true,
                    maxTicksLimit: 10,
                    beginAtZero: false,
                    callback: function (value) {
                      return (
                        props.currencysymbols +
                        value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      );
                    },
                  },
                  gridLines: {
                    display: false,
                  },
                },
              ],
              xAxes: [
                {
                  ticks: {
                    maxTicksLimit: 4,
                    maxRotation: 0,
                    minRotation: 0,
                  },
                  gridLines: {
                    display: false,
                  },
                },
              ],
            },
          }}
        />
      </td>
      <td className="charts">
        <Bar
          redraw={redraw}
          data={chartVol}
          options={{
            legend: {
              display: false,
            },
            tooltips: {
              displayColors: false,
              mode: "x-axis",
              backgroundColor: "rgb(238, 221, 226)",
              bodyFontColor: "rgb(91, 38, 57)",
              titleFontColor: "rgb(91, 38, 57)",
              borderWidth: 1,
              borderColor: "rgb(226, 207, 213)",
              callbacks: {
                label: function (tooltipItems) {
                  return (
                    symbol +
                    tooltipItems.yLabel
                      .toFixed(0)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  );
                },
              },
            },
            responsive: true,
            title: { text: "THICCNESS SCALE", display: false },
            elements: {
              point: {
                radius: 0,
              },
              line: {
                tension: 0.05,
              },
            },
            scales: {
              yAxes: [
                {
                  ticks: {
                    autoSkip: true,
                    maxTicksLimit: 10,
                    beginAtZero: false,
                    callback: function (value) {
                      return (
                        props.currencysymbols +
                        value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      );
                    },
                  },
                  gridLines: {
                    display: false,
                  },
                },
              ],
              xAxes: [
                {
                  ticks: {
                    maxTicksLimit: 4,
                    maxRotation: 0,
                    minRotation: 0,
                  },
                  gridLines: {
                    display: false,
                  },
                },
              ],
            },
          }}
        />
      </td>
    </div>
  );
};

export default Chart;
