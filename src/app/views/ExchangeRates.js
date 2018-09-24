import React from "react";
import _ from "lodash";
import { Helmet } from "react-helmet";
import accounting from "accounting";
import injectClient from "../../lib/ClientComponent";
import currencyPrecision from "../../lib/CurrencyPrecision";

const cryptoCurrencies = ["BTC", "NANO"];

class ExchangeRates extends React.PureComponent {
  state = {
    value: 1
  };

  getHighlightedCurrencies() {
    const { ticker, fiatCurrencies } = this.props.config;
    const { value } = this.state;

    return cryptoCurrencies.concat(fiatCurrencies).map(cur => (
      <h1 key={cur}>
        {accounting.formatMoney(ticker[cur].price * value, {
          symbol: cur,
          format: "%v %s",
          precision: currencyPrecision(cur)
        })}
      </h1>
    ));
  }

  getOtherCurrencies() {
    const { ticker, fiatCurrencies } = this.props.config;
    const { value } = this.state;

    const otherCurrencies = _.fromPairs(
      _.filter(
        _.toPairs(ticker),
        d => !fiatCurrencies.includes(d[0]) && !cryptoCurrencies.includes(d[0])
      )
    );

    return _.map(otherCurrencies, (data, cur) => (
      <h3 key={cur}>
        {accounting.formatMoney(data.price * value, {
          symbol: cur,
          format: "%v %s",
          precision: currencyPrecision(cur)
        })}
      </h3>
    ));
  }

  bananoPerNano() {
    const { ticker } = this.props.config;
    return 1.0 / ticker.NANO.price;
  }

  render() {
    const { config } = this.props;

    return (
      <div className="row my-5 mx-0">
        <Helmet>
          <title>Banano Exchange Rates</title>
        </Helmet>
        <div className="col">
          <div className="row justify-content-center">
            <div className="col-12 col-md-10">
              <div className="row align-items-center">
                <div className="col">
                  <h1>Exchange Rates</h1>
                </div>
                <div className="col-auto">
                  <h4>
                    1 NANO ={" "}
                    {accounting.formatMoney(this.bananoPerNano(), {
                      symbol: "BAN",
                      format: "%v %s",
                      precision: 2
                    })}
                  </h4>
                </div>
              </div>

              <hr />
            </div>
          </div>

          <div className="row justify-content-center mt-3">
            <div className="col-12 col-md-5">
              <div className="input-group mb-2">
                <input
                  type="number"
                  className="form-control form-control-lg"
                  min="0"
                  value={this.state.value || ""}
                  onChange={e =>
                    this.setState({
                      value: e.target.value
                        ? parseFloat(e.target.value, 10)
                        : null
                    })
                  }
                />
                <div className="input-group-append">
                  <div className="input-group-text">BAN</div>
                </div>
              </div>
              <p className="text-muted">Price data provided by Mercatox.</p>
            </div>
            <div className="col-12 col-md-5">
              {this.getHighlightedCurrencies()}
              <hr />
              {this.getOtherCurrencies()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default injectClient(ExchangeRates);
