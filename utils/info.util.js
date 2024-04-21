const {fahrenheitToCelsius} = require("./temperature.util")
const moment = require("moment")

const analysisWeatherInfo = ({current, date}) => {
    const weatherInfo = {
        time: moment(current.LocalObservationDateTime).format('MMMM Do YYYY, h:mm:ss a'),
        current: {
            "Weather Status": current.WeatherText,
            "Temperature": current.Temperature.Metric.Value + "\u00B0C"
        },

        day: {
            "Minimun Temperature": fahrenheitToCelsius(date.DailyForecasts[0].Temperature.Minimum.Value) + "\u00B0C",
            "Maximun Temperature": fahrenheitToCelsius(date.DailyForecasts[0].Temperature.Maximum.Value) + "\u00B0C",
            "Day Status": date.DailyForecasts[0].Day.IconPhrase,
            "Night Status": date.DailyForecasts[0].Night.IconPhrase
        }
    }
    return weatherInfo
}

const isWeatherSyntax = (text) => {
    //syntax: "Weather: {city}"
    const regex = /^Weather:\s{1}[\p{L}\s]+$/u;

    const match = regex.test(text);

    return match
}

module.exports = {
    analysisWeatherInfo,
    isWeatherSyntax
}