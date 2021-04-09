const token = 'Tpk_219118a840804c0e83a9d0c7fbc7e1bc'        // need to update these for the real app
const baseURL = 'https://sandbox.iexapis.com/stable/stock'       // need to update these for the real app

let stockPick = 'GME'
let buyingPower = 100000;
let portfolioValue = buyingPower;
let portfolioArr = [];


document.getElementById('buyBtn').addEventListener('click', onClick)

function onClick(e){
  e.preventDefault()
  console.log(historicalData)
  testStock.marketValue = historicalData.close
}




//==== Constructors Go Here ====//


class Stock {
  constructor(ticker, shares, cost, date, currentPrice) {
    this.ticker = ticker
    this.shares = shares
    this.cost = cost
    this.purchaseDate = date
    this.marketValue = shares * currentPrice
  }
}

const testStock = new Stock('gme', 10, 15.20, 'jan 15, 2021', 2)




//==== Functions Go Here ====//


// Buying a stock
// function buyStock(e){
//   e.preventDefault()
    
  
//   let cost  // run 
  
  
//   let cost // 1. grab the price of the stock at the given year
//   let shares // 2. grab the number of stocks to buy from input field
//   buyingPower -= cost * shares
  
//   // 3. push stock to portfolio array using the constructor StockAdd
//   // 4. update portfolioValue
//   // this should be the sum of all the marketvalues of the portfolio array. maybe a for-loop or reduce method?
  
//   // 5. update portfolioChart **********
// }

// setMarketValue() {
//   this.marketValue = getQuote(this.ticker) * shares
//   return
// }

// let response 


// to get the quote of the selected stock
async function getQuote(ticker) {
  let url = `${baseURL}/${ticker}/quote?token=${token}`
  fetch(url)
  .then(result => result.json())
  .then(result => {
    console.log(`${result.symbol}, ${result.latestPrice}`)
    console.log(typeof(result.latestPrice))
    
  })
  .catch(err => {
    console.log('something went wrong', err)
  })
}


// to get batch quotes 
async function getBatchQuotes() {
  let url = `${baseURL}/market/batch?symbols=aapl,fb,xom,gme&types=quote&range=1m&last=5&token=${token}`
  fetch(url)
  .then(result => result.json())
  .then(result => {
        
  })
  .catch(err => {
    console.log('something went wrong', err)
  })
}







// to get the historical quote of the selected stock
// async function getHistoricQuote (ticker, date) {
//   let url = `${baseURL}/stock/${ticker}/quote?token=${token}`
//   fetch(url)
//   .then(result => result.json())
//   .then(result => {
    
//   })
//   .catch(err => {
//     console.log('something went wrong', err)
//   })
// }












// use later
  class Portfolio {
    constructor(){
      this.name = "Portfolio"
      this.buyingPower = 100000
      this.value = this.buyingPower
      this.stocks = []
    }
  
    buyStock(stock){
    }
    
    sellStock(ticker){
      const index = this.stocks.findIndex(s => s.ticker === ticker)
      this.stocks.splice(index,1)
    }
  }