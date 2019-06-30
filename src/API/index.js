import categories from "../data/categories.json"
import merchants from "../data/merchants.json"
import transactions from "../data/transactions.json"

function wait() {
  const requestTime = Math.floor(Math.random() * 2000)
  return new Promise(resolve => setTimeout(resolve, requestTime))
}

export const fetchCategories = async () => {
  await wait()
  return categories
}

export const fetchMerchants = async () => {
  await wait()

  return merchants
}

export const fetchTransactions = async () => {
  await wait()
  const data = transactions.map(t => {
    const date = new Date(t.date).getTime()
    return { ...t, date }
  })
  return data.sort((a, b) => b.date - a.date)
}

export const removeUser = async () => {
  await wait()
  return { authenticated: false }
}

export const addUser = async () => {
  await wait()
  return { authenticated: true }
}
