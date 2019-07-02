import React from "react"
import { useTableContext, onFilterAmountChange } from "./context"
import DropDown from "./DropDown"

export default function FilterByFields() {
  const { state, dispatch } = useTableContext()

  function onStartDateSelect(e) {
    alert(e.target.value)
  }

  function handleAmountChange(e) {
    onFilterAmountChange(dispatch, e.target.value)
  }

  return (
    <div className="w-full lg:w-2/5 flex mt-8">
      <DropDown
        label="status"
        options={["all", "complete", "incomplete", "exported"]}
      />

      <DropDown
        label="merchant"
        options={["all", "Woolworths", "Facebook", "Google"]}
      />
      <div className="flex flex-col mr-4">
        <label
          className="ml-1 text-xs font-semibold uppercase tracking-widest text-gray-500"
          for="start"
        >
          Start date
        </label>
        <input
          className="mr-1 mt-1 pl-3 py-1 rounded-lg shadow focus:outline-none"
          type="date"
          id="start"
          name="trip-start"
          value="2018-07-22"
          min="2018-01-01"
          max="2018-12-31"
        />
      </div>
      <div className="flex flex-col mr-4">
        <label
          className="ml-1 text-xs font-semibold uppercase tracking-widest text-gray-500"
          for="start"
        >
          End date
        </label>
        <input
          className="mr-1 mt-1 pl-3 py-1 rounded-lg shadow  focus:outline-none"
          type="date"
          id="end"
          name="trip-start"
          value="2018-07-22"
          min="2018-01-01"
          max="2018-12-31"
          onChange={onStartDateSelect}
        />
      </div>
      <div className="flex flex-col">
        <label
          className="ml-1 text-xs font-semibold uppercase tracking-widest text-gray-500"
          for="amount"
        >
          Amount
        </label>
        <input
          className="w-32 mr-1 mt-1 focus:outline-none shadow rounded-lg px-3 py-1 bg-white border focus:border-indigo-400"
          type="number"
          id="amount"
          value={state.filterAmount}
          onChange={handleAmountChange}
        />
      </div>

      {/* <DropDown
        label="date"
        options={["all", "complete", "incomplete", "exported"]}
      />

      <DropDown
        label="amount"
        options={["all", "complete", "incomplete", "exported"]}
      /> */}
      {/* <div className="ml-auto  font-bold">
        {state.filteredData.length !== 0 && (
          <>
            <span className="text-indigo-500">{state.filteredData.length}</span>{" "}
            <span className="text-gray-500 mr-1">items</span>
          </>
        )}
      </div> */}
    </div>
  )
}
