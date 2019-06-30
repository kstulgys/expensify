import React, { useState, useRef, useEffect } from "react"
import { useTableContext, onFilterTextChange } from "./context"

export default function FilterByText() {
  const { state, dispatch } = useTableContext()
  const [nothingFound, setNotFound] = useState(null)

  const inputRef = useRef(state.dataFilterText)

  useEffect(() => {
    inputRef.current.focus()
  }, [])

  useEffect(() => {
    const nothingFound =
      !state.filteredData.length &&
      state.dataFilterText !== "" &&
      "Nothing was found"
    setNotFound(nothingFound)
  }, [state.dataFilterText, state.filteredData])

  function handleSearch(e) {
    onFilterTextChange(dispatch, e.target.value)
  }

  return (
    <>
      <div className="h-6 pl-1 text-indigo-600">
        <p>{nothingFound}</p>
      </div>
      <div className="flex items-center lg:w-2/5 mb-5">
        <div className="w-full">
          <input
            ref={inputRef}
            // onBlur={() => setBlurred(!blurred)}
            value={state.dataFilterText}
            onChange={handleSearch}
            placeholder="Search"
            className="w-full text-gray-600 focus:outline-none shadow px-4 py-2 rounded-lg bg-white border-2 focus:border-indigo-400"
          />
        </div>
        {/* <div className="ml-auto">
          <button className="border-0 focus:outline-none appearance-none block outline-none bg-white hover:bg-indigo-600 hover:text-white text-indigo-600 py-2 px-4 rounded-full shadow">
            Filter
          </button>
        </div> */}
      </div>
    </>
  )
}
