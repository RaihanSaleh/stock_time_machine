const token = 'Tpk_219118a840804c0e83a9d0c7fbc7e1bc'        // need to update these for the real app
const baseURL = 'https://sandbox.iexapis.com/stable/stock'       // need to update these for the real app

class Stock {
  constructor(stockTicker, purchaseDate, pricePerShare, numOfShares) {
    this.stockTicker = stockTicker
    this.purchaseDate = purchaseDate
    this.pricePerShare = pricePerShare
    this.numOfShares = numOfShares
  }
}

class Portfolio {
  constructor(){
    this.buyingPower = 100000
    this.purchasedStocks = []
    this.stockTickers = []
    this.sharesPerStock = {}
  }
  addStock(purchasedStock){
    this.purchasedStocks.push(purchasedStock)
    this.stockTickers.push(purchasedStock.stockTicker)
    this.sharesPerStock[purchasedStock.stockTicker] = purchasedStock.numOfShares
  }
  getStockTickers(){
    return this.stockTickers
  }
  getSharesPerStock(stockTicker){
    return this.sharesPerStock[stockTicker]
  }
}

let portfolio = new Portfolio()

// ===== Phase One: Get a price of a stock at a certain date ===== //
document.getElementById('getHistoricalDayPrice').addEventListener('click', getHistorricalDayPrice)

async function getHistorricalDayPrice() {
  let stockTicker  = document.getElementById('stockTicker').value
  let historicalDate  = document.getElementById('historicalDate').value
  
  // console.log(`stockTicker: ${stockTicker}`)
  // console.log(`historicalDate: ${historicalDate}`)
  
  let url = `${baseURL}/${stockTicker}/chart/3m?filter=symbol,date,close&token=${token}`
  
  fetch(url)
  .then(result => result.json())
  .then(dailyData => {
    // console.log(`dailyData: ${dailyData}`)
    for (dayData of dailyData) {
      if (dayData.date === historicalDate) {
        let historicalDayPrice = dayData.close
        // console.log(`historicalDayPrice: ${historicalDayPrice}`)
        document.getElementById('historicalDayPrice').value = historicalDayPrice
        break
      }
    }
  })
  .catch(err => {
    console.log('something went wrong', err)
  })
}


// ===== Phase Two: Purchase Stock ===== //
document.getElementById('buyButton').addEventListener('click', makePurchase)

function makePurchase(){
  let stockTicker = document.getElementById('stockTicker').value
  let purchaseDate = document.getElementById('historicalDate').value
  let pricePerShare = document.getElementById('historicalDayPrice').value
  let numOfShares = document.getElementById('sharesToBuy').value
  let totalPurchasePrice = pricePerShare * numOfShares
  
  console.log(`stockTicker: ${stockTicker}`)
  console.log(`purchaseDate: ${purchaseDate}`)
  console.log(`pricePerShare: ${pricePerShare}`)
  console.log(`numOfShares: ${numOfShares}`)
  console.log(`totalPurchasePrice: ${totalPurchasePrice}`)
  
  let purchasedStock = new Stock(stockTicker, purchaseDate, pricePerShare, numOfShares)
  portfolio.addStock(purchasedStock)
}


document.getElementById('updatePortfolioValue').addEventListener('click', updatePortfolioValue)

async function updatePortfolioValue() {
  let stockTickers = portfolio.getStockTickers()
  let url = `${baseURL}/market/batch?symbols=${stockTickers.join()}&types=quote&token=${token}`
  
  fetch(url)
  .then(result => result.json())
  .then(stockQuotes => {
    console.log(stockQuotes)
    
    let portfolioValue = 0
    for (stockTicker of stockTickers) {
      portfolioValue += stockQuotes[stockTicker]["quote"]["latestPrice"] * portfolio.getSharesPerStock(stockTicker)
    }
    console.log(`portfolioValue: ${portfolioValue}`)

    document.getElementById('portfolioValue').innerText = portfolioValue
  })
  .catch(err => {
    console.log('something went wrong', err)
  })
}








// // Buying a stock
// // function buyStock(e){
// //   e.preventDefault()
    
  
// //   let cost  // run 
  
  
// //   let cost // 1. grab the price of the stock at the given date
// //   let shares // 2. grab the number of stocks to buy from input field
// //   buyingPower -= cost * shares
  
// //   // 3. push stock to portfolio array using the constructor Stock
// //   // 4. update portfolioValue
// //   // this should be the sum of all the marketvalues of the portfolio array. maybe a for-loop or reduce method?
  
// //   // 5. update portfolioChart **********
// // }
