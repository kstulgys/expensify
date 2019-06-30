import React, { useEffect } from "react"
import LoaderSVG from "./LoaderSVG"
import { format } from "date-fns"
import { useTableContext, filterData, onBillableChange } from "./context"

export default function DataTable() {
  const { state, dispatch } = useTableContext()

  useEffect(() => {
    filterData(state, dispatch)
  }, [
    state.tableData,
    state.dataFilterText,
    state.filterStatus,
    state.filterMerchant
  ])

  if (!state.tableData.length) {
    return (
      <div className="flex justify-center pt-12">
        <LoaderSVG />
      </div>
    )
  }

  return (
    <section className="">
      <div class="table w-full bg-white rounded-lg shadow-xl">
        <TableHead />
        <DataTableRows tableData={state.filteredData} />
      </div>
    </section>
  )
}

function TableHead() {
  return (
    <div className="table-row uppercase text-indigo-400">
      {tableHead.map((th, i) => {
        return (
          <div className="table-cell px-4 pt-4 pb-5 tracking-widest">{th}</div>
        )
      })}
    </div>
  )
}

function DataTableRows({ tableData }) {
  const { state, dispatch } = useTableContext()

  const cellStyle =
    "table-cell border-solid border border-0 border-gray-100 py-5 px-4 block"
  return tableData.map(transaction => {
    return (
      <div key={transaction.id} className="table-row">
        <div className={`${cellStyle} border-l-0 text-center`}>
          <StatusIcon status={transaction.status} />
        </div>
        <div className={cellStyle}>{FormatDate(transaction.date)}</div>
        <div className={cellStyle}>{transaction.merchant.name}</div>
        <div className={cellStyle}>{transaction.team_member}</div>
        <div className={cellStyle}>{transaction.category.name}</div>
        <div className={cellStyle}>{transaction.budget}</div>
        <div className={`${cellStyle} text-center`}>
          <ReceiptIcon status={transaction.receipt} />
        </div>
        <div className={`${cellStyle} text-center`}>
          <input
            type="checkbox"
            checked={transaction.billable}
            onChange={() => onBillableChange(state, dispatch, transaction.id)}
          />
        </div>
        <div className={cellStyle}>{transaction.gst}</div>
        <div className={`${cellStyle} border-r-0`}>{transaction.amount}</div>
      </div>
    )
  })
}

const tableHead = [
  "Status",
  "Date",
  "Merchant",
  "Team Member",
  "Category",
  "Budget",
  "Receipt",
  "Billable",
  "GST",
  "Amount"
]

function StatusIcon({ status }) {
  if (status === "complete") {
    return <i class="fas fa-check-circle fa-lg text-indigo-500" />
  }
  if (status === "incomplete") {
    return <i class="fas fa-exclamation-circle fa-lg text-yellow-500" />
  }
  if (status === "exported") {
    return <i class="fas fa-arrow-alt-circle-right fa-lg text-green-500" />
  }
  return null
}

function ReceiptIcon({ status }) {
  if (status) {
    return <i class="fas fa-receipt fa-lg text-indigo-500" />
  } else {
    return <i class="fas fa-receipt fa-lg text-yellow-500" />
  }
}

//<i class="fas fa-receipt"></i>

function FormatDate(date) {
  return format(date, "MM.DD.YY")
}
