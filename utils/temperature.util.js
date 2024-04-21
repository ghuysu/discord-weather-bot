const fahrenheitToCelsius = (fahrenheit) => {
    return ((fahrenheit - 32) / 1.8).toFixed(1);
}

module.exports = {
    fahrenheitToCelsius
}