const removeOrder = (array, elem) => {
  var index = array.indexOf(elem)

  if (index > -1) {
    array.splice(index, 1)
  }

  return array
}

const getBuyOrders = (existingBook) => {
  return existingBook.filter((book) => book.type === 'buy')
}

const getSellOrders = (existingBook) => {
  return existingBook.filter((book) => book.type === 'sell')
}

const reconcileOrder = (existingBook, incomingOrder) => {
  if (incomingOrder.type === 'sell') {
    const buyOrders = getBuyOrders(existingBook)

    if (buyOrders.length === 0) {
      existingBook.push(incomingOrder)
    } else {
      let found = false

      for (let buyOrder of buyOrders) {
        if (incomingOrder.price <= buyOrder.price) {
          found = true

          if (incomingOrder.quantity < buyOrder.quantity) {
            let newBuyOrder = { ...buyOrder }

            newBuyOrder.quantity -= incomingOrder.quantity

            existingBook = removeOrder(existingBook, buyOrder)
            existingBook.push(newBuyOrder)
            break
          } else if (incomingOrder.quantity === buyOrder.quantity) {
            existingBook = removeOrder(existingBook, buyOrder)
            break
          } else {
            existingBook = removeOrder(existingBook, buyOrder)
            let newSellOrder = incomingOrder

            newSellOrder.quantity -= buyOrder.quantity

            if (getBuyOrders(existingBook).length === 0) {
              existingBook.push(newSellOrder)
              break
            } else {
              return reconcileOrder(existingBook, newSellOrder)
            }
          }
        }
      }

      if (!found) {
        existingBook.push(incomingOrder)
      }
    }
  } else if (incomingOrder.type === 'buy') {
    const sellOrders = getSellOrders(existingBook)

    if (sellOrders.length === 0) {
      existingBook.push(incomingOrder)
    } else {
      let found = false

      for (let sellOrder of sellOrders) {
        if (incomingOrder.price >= sellOrder.price) {
          found = true

          if (incomingOrder.quantity < sellOrder.quantity) {
            let newSellOrder = { ...sellOrder }

            newSellOrder.quantity -= incomingOrder.quantity

            existingBook = removeOrder(existingBook, sellOrder)
            existingBook.push(newSellOrder)
            break
          } else if (incomingOrder.quantity === sellOrder.quantity) {
            existingBook = removeOrder(existingBook, sellOrder)
            break
          } else {
            existingBook = removeOrder(existingBook, sellOrder)
            let newBuyOrder = incomingOrder

            newBuyOrder.quantity -= sellOrder.quantity

            if (getSellOrders(existingBook).length === 0) {
              existingBook.push(newBuyOrder)
              break
            } else {
              return reconcileOrder(existingBook, newBuyOrder)
            }
          }
        }
      }

      if (!found) {
        existingBook.push(incomingOrder)
      }
    }
  }

  return existingBook
}

module.exports = reconcileOrder
