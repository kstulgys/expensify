import React from "react"
import { useTableContext } from "./context"
import DropDown from "./DropDown"

export default function FilterByFields() {
  const { state } = useTableContext()
  return (
    <div className="w-full lg:w-2/5 flex mt-8">
      <DropDown
        label="merchant"
        options={["all", "Woolworths", "Facebook", "Google"]}
      />
      <DropDown
        label="status"
        options={["all", "complete", "incomplete", "exported"]}
      />
      <div className="ml-auto  font-bold">
        {state.filteredData.length !== 0 && (
          <>
            <span className="text-indigo-500">{state.filteredData.length}</span>{" "}
            <span className="text-gray-500 mr-1">items</span>
          </>
        )}
      </div>
    </div>
  )
}
