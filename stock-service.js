const url = 'https://sandbox.iexapis.com/stable/stock/gme/quote?token=Tpk_219118a840804c0e83a9d0c7fbc7e1bc'
let historicalData = {}

class StockService {
  static async fetchHistorical() {
    fetch(url)
      .then(result => result.json())
      .then(result => {historicalData = result})
  }
}

StockService.fetchHistorical()