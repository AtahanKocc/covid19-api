const PORT = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()

const newspapers = [
    {
        name: 'nyt',
        address: 'https://www.nytimes.com/news-event/coronavirus',
        base: '',
    },
    {
        name:'who',
        address: 'https://www.who.int/westernpacific/emergencies/covid-19/news-covid-19',
        base: '',
    },
    {
        name:'nbc',
        address: 'https://www.nbcnews.com/health/coronavirus',
        base: '',
    },
    {
        name:'bbc',
        address:'https://www.bbc.com/news/world-us-canada-62959089',
        base: '',
    },
    {
        name:'ap',
        address: 'https://apnews.com/hub/coronavirus-pandemic',
        base: '',
    },
    {
        name:'scientist',
        address: 'https://www.the-scientist.com/tag/covid-19',
        base: '',
    },
    {
        name:'daily',
        address:'https://www.hurriyetdailynews.com/index/covid-19',
        base: '',
    },
    {
        name: 'cnn',
        address: 'https://edition.cnn.com/specials/world/coronavirus-outbreak-intl-hnk',
        base: '',
    },
    {
        name:'nyt',
        address: 'https://www.nytimes.com/article/bivalent-booster-covid.html',
        base: '',
    },
    {
        name:'ndtv',
        address:'https://www.ndtv.com/coronavirus',
        base: '',
    },
]


const articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("covid19")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })
            })

        })
})




app.get('/', (req, res) => {
    res.json('Welcome to my Covid19 News API')
})

app.get('/news',(req,res)=> {
    res.json(articles)
})
app.get('/news/:newspaperId', (req, res) => {
    const newspaperId = req.params.newspaperId

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base


    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("covid19")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperId
                })
            })
            res.json(specificArticles)
        }).catch(err => console.log(err))
})

app.listen(PORT, ()=> console.log(`server running on Port ${PORT}`))
