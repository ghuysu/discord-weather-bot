require('dotenv').config()
const axios = require("axios")
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const {checkLocationInCSV, addLocationKeyToCSV} = require("./utils/csv.util")
const {analysisWeatherInfo, isWeatherSyntax} = require("./utils/info.util")


const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages] 
});

client.on('ready', ()=>{
    console.log(`Logged in as ${client.user.tag}!`)
})

client.login(process.env.BOT_TOKEN)

client.on('messageCreate', async message => {
    if(message.author.bot) return false

    if(message.mentions.has(client.user.id)){

        let text = message.content        
        console.log(text)

        text = text.substring(text.indexOf(">") + 2, text.length)
        
        const match = isWeatherSyntax(text)

        if(match){
            const location = text.split(":")[1].trim()
            
            let existedKey = await checkLocationInCSV(location)

            if(existedKey == false){
                const api = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${process.env.WEATHER_API_KEY}&q=${location}`
                const apiResponse = await axios.get(api)
                console.log({api, apiResponse})
                if(apiResponse.data.length === 0){
                    const embed = new EmbedBuilder()
                    .setTitle(`Weather forecast for ${location}`)
                    .setColor('Red')
                    .addFields(
                        { name: 'Error', value: `${location} (city/country) is not found` },
                    )

                    return message.channel.send({embeds: [embed]})
                }
                else{
                    const resKey = apiResponse.data[0].Key

                    await addLocationKeyToCSV({location, key: resKey})
    
                    existedKey = resKey
                }
            }
            console.log({
                existedKey, location
            })

            const currentUrl = `http://dataservice.accuweather.com/currentconditions/v1/${existedKey}?apikey=${process.env.WEATHER_API_KEY}`
            const dateUrl = `http://dataservice.accuweather.com/forecasts/v1/daily/1day/${existedKey}?apikey=${process.env.WEATHER_API_KEY}`
            const currentResponse = await axios.get(currentUrl)
            const dateResponse = await axios.get(dateUrl)
            
            const info = await analysisWeatherInfo({current: currentResponse.data[0], date: dateResponse.data})
            console.log(info)

            const embed = new EmbedBuilder()
                .setTitle(`Weather forecast for ${location}`)
                .setColor('#0099ff')
                .addFields(
                    { name: 'Time', value: info.time },
                    { name: 'Current Weather', value: `${info.current['Weather Status']}, Temperature: ${info.current.Temperature}` },
                    { name: 'Day Weather', value: `Min Temperature: ${info.day['Minimun Temperature']} \nMax Temperature: ${info.day['Maximun Temperature']} \nDay Status: ${info.day['Day Status']} \nNight Status: ${info.day['Night Status']}` }
                )

            message.channel.send({embeds: [embed]})
        }
    }
});