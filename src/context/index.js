import React, {
  useMemo,
  createContext,
  useReducer,
  useContext,
  useEffect
} from "react"
import * as API from "../API"

const TableContext = createContext()
const useTableContext = () => useContext(TableContext)

const initialState = {
  tableData: [],
  filteredData: [],
  categories: [],
  merchants: [],

  filterTerm: "",
  filterStatus: "all",
  filterDate: ["from", ""],
  filterMerchant: "all",
  filterAmount: ""

  // authUser: { authenticated: false, userName: null },
  // userLoading: false,
  //   dataLoading: true,
  //   filterStatus: null,
  //   filterMerchant: null
}

function reducer(state, action) {
  switch (action.type) {
    case "TABLE_DATA":
      return {
        ...state,
        tableData: action.tableData
      }
    case "FILTERED_DATA":
      return { ...state, filteredData: action.filteredData }
    case "CATEGORIES":
      return {
        ...state,
        categories: action.categories
      }
    case "MERCHANTS":
      return {
        ...state,
        merchants: action.merchants
      }

    case "FILTER_STATUS":
      return { ...state, filterStatus: action.filterStatus }
    case "FILTER_MERCHANT":
      return { ...state, filterMerchant: action.filterMerchant }
    case "DATA_FILTER_TEXT":
      return { ...state, filterTerm: action.filterTerm }

    case "FILTER_AMOUNT":
      return { ...state, filterAmount: action.filterAmount }

    // case "USER_LOADING":
    //   return { ...state, userLoading: action.payload }
    // case "LOGIN_USER":
    //   return { ...state, authUser: action.authUser }
    // case "LOGOUT_USER":
    // return { ...state, authUser: { authenticated: false, userName: null } }
    default:
      return state
  }
}

function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const contextValue = useMemo(() => ({ state, dispatch }), [state, dispatch])

  useEffect(() => {
    API.fetchCategories().then(categories => {
      dispatch({ type: "CATEGORIES", categories })
    })

    API.fetchMerchants().then(merchants => {
      dispatch({ type: "MERCHANTS", merchants })
    })
  }, [])

  useEffect(() => {
    if (state.categories.length && state.merchants.length) {
      getTableData(state, dispatch)
    }
  }, [state.categories, state.merchants])

  return (
    <TableContext.Provider value={contextValue}>
      {children}
    </TableContext.Provider>
  )
}

async function getTableData(state, dispatch) {
  const transactions = await API.fetchTransactions()
  const tableData = transactions.map(transaction => {
    const category = state.categories.find(
      category => category.id === transaction.category
    )
    const merchant = state.merchants.find(
      merchant => merchant.id === transaction.merchant
    )
    return { ...transaction, category, merchant }
  })

  dispatch({ type: "TABLE_DATA", tableData })
  dispatch({ type: "FILTERED_DATA", filteredData: tableData })
}

function filterData(state, dispatch) {
  let filteredData = state.tableData
  // merchant, category, budget, gst, amount, team member
  if (state.filterTerm !== "") {
    filteredData = filterDataByTerm(state.filterTerm, filteredData)
  }
  // Status
  if (state.filterStatus !== "all") {
    filteredData = filterDataByStatus(state.filterStatus, filteredData)
  }
  // Merchant
  if (state.filterMerchant !== "all") {
    filteredData = filterDataByMerchant(state.filterMerchant, filteredData)
  }
  // Amount
  if (state.filterAmount !== "") {
    filteredData = filterDataByAmount(state.filterAmount, filteredData)
  }
  // Date
  // if (state.filterDate !== "all") {
  //   filteredData = filterDataByDate(state.filterDate, filteredData)
  // }

  dispatch({
    type: "FILTERED_DATA",
    filteredData
  })
}

function filterDataByTerm(filterTerm, data) {
  return data.filter(
    t =>
      t.category.name.toLowerCase().includes(filterTerm.toLowerCase()) ||
      t.merchant.name.toLowerCase().includes(filterTerm.toLowerCase()) ||
      t.budget
        .toString()
        .toLowerCase()
        .includes(filterTerm.toLowerCase()) ||
      t.gst
        .toString()
        .toLowerCase()
        .includes(filterTerm.toLowerCase()) ||
      t.amount
        .toString()
        .toLowerCase()
        .includes(filterTerm.toLowerCase())
  )
}

function filterDataByStatus(filterStatus, data) {
  return data.filter(t => t.status === filterStatus)
}

function filterDataByAmount(filterAmount, data) {
  return data.filter(t => t.amount.toString().includes(filterAmount))
}

function filterDataByMerchant(filterMerchant, data) {
  return data.filter(t => t.merchant.name === filterMerchant)
}

function onBillableChange(state, dispatch, id) {
  const filteredData = state.filteredData.map(t => {
    if (t.id === id) {
      return { ...t, billable: !t.billable }
    }
    return t
  })

  const tableData = state.tableData.map(t => {
    if (t.id === id) {
      return { ...t, billable: !t.billable }
    }
    return t
  })

  dispatch({ type: "TABLE_DATA", tableData })
  dispatch({ type: "FILTERED_DATA", filteredData })
}

function onfilterStatusChange(dispatch, filterStatus) {
  dispatch({
    type: "FILTER_STATUS",
    filterStatus
  })
  // dispatch({
  //   type: "DATA_FILTER_TEXT",
  //   filterTerm: ""
  // })
}

function onfilterMerchantChange(dispatch, filterMerchant) {
  dispatch({
    type: "FILTER_MERCHANT",
    filterMerchant
  })
  // dispatch({
  //   type: "DATA_FILTER_TEXT",
  //   filterTerm: ""
  // })
}

function onFilterTextChange(dispatch, filterTerm) {
  dispatch({
    type: "DATA_FILTER_TEXT",
    filterTerm
  })
}

function onFilterAmountChange(dispatch, filterAmount) {
  dispatch({
    type: "FILTER_AMOUNT",
    filterAmount
  })
}

export {
  Provider,
  useTableContext,
  getTableData,
  onFilterAmountChange,
  onfilterStatusChange,
  onfilterMerchantChange,
  onFilterTextChange,
  onBillableChange,
  filterData
}
