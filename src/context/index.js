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
  dataFilterText: "",
  filterStatus: "all",
  filterMerchant: "all",
  categories: [],
  merchants: []

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
      return { ...state, dataFilterText: action.dataFilterText }

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

function filterDataByText(state, data) {
  return data.filter(
    t =>
      t.category.name
        .toLowerCase()
        .includes(state.dataFilterText.toLowerCase()) ||
      t.merchant.name
        .toLowerCase()
        .includes(state.dataFilterText.toLowerCase()) ||
      t.budget
        .toString()
        .toLowerCase()
        .includes(state.dataFilterText.toLowerCase()) ||
      t.gst
        .toString()
        .toLowerCase()
        .includes(state.dataFilterText.toLowerCase()) ||
      t.amount
        .toString()
        .toLowerCase()
        .includes(state.dataFilterText.toLowerCase())
  )
}

function filterByMerchant(state) {
  return state.tableData.filter(t => t.merchant.name === state.filterMerchant)
}
function filterByStatus(state) {
  return state.tableData.filter(t => t.status === state.filterStatus)
}

function filterData(state, dispatch) {
  const isFilterActive =
    state.filterStatus !== "all" || state.filterMerchant !== "all"

  let filteredData

  if (state.dataFilterText === "" && !isFilterActive) {
    filteredData = state.tableData
  }

  if (state.dataFilterText === "" && isFilterActive) {
    if (state.filterMerchant !== "all" && state.filterStatus === "all") {
      filteredData = filterByMerchant(state)
    }
    if (state.filterMerchant === "all" && state.filterStatus !== "all") {
      filteredData = filterByStatus(state)
    }

    if (state.filterMerchant !== "all" && state.filterStatus !== "all") {
      filteredData = filterByMerchant(state).filter(
        t => t.status === state.filterStatus
      )
    }
  }

  if (state.dataFilterText !== "" && !isFilterActive) {
    filteredData = filterDataByText(state, state.tableData)
  }

  if (state.dataFilterText !== "" && isFilterActive) {
    filteredData = filterDataByText(state, state.filteredData)
  }

  dispatch({
    type: "FILTERED_DATA",
    filteredData
  })
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
  dispatch({
    type: "DATA_FILTER_TEXT",
    dataFilterText: ""
  })
}

function onfilterMerchantChange(dispatch, filterMerchant) {
  dispatch({
    type: "FILTER_MERCHANT",
    filterMerchant
  })
  dispatch({
    type: "DATA_FILTER_TEXT",
    dataFilterText: ""
  })
}

function onFilterTextChange(dispatch, dataFilterText) {
  dispatch({
    type: "DATA_FILTER_TEXT",
    dataFilterText
  })
}

export {
  Provider,
  useTableContext,
  getTableData,
  filterDataByText,
  onfilterStatusChange,
  onfilterMerchantChange,
  onFilterTextChange,
  onBillableChange,
  filterData
}
