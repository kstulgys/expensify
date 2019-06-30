import React, { useState } from "react"
import {
  useTableContext,
  onfilterStatusChange,
  onfilterMerchantChange
} from "./context"

export default function DropDown({ label, options }) {
  const { state, dispatch } = useTableContext()
  const [isOpen, setOpen] = useState(false)

  function handleSelectStatus(status) {
    onfilterStatusChange(dispatch, status)
    setOpen(!isOpen)
  }

  function handleSelectMerchant(merchant) {
    onfilterMerchantChange(dispatch, merchant)
    setOpen(!isOpen)
  }

  const onChangeHandler =
    label === "status" ? handleSelectStatus : handleSelectMerchant
  const name = label === "status" ? state.filterStatus : state.filterMerchant

  return (
    <div className="flex flex-col mr-4">
      <label className="ml-1 text-xs font-semibold uppercase tracking-widest text-gray-500">
        {label}
      </label>
      <div class="flex items-center justify-center mr-1 mt-1">
        <div class="relative" style={{ width: 101 }}>
          <button
            onClick={() => setOpen(!isOpen)}
            class="flex items-center focus:outline-none w-full"
          >
            <span class="ml-1">{name}</span>
            <span class="ml-auto mr-1">
              {isOpen ? (
                <i class="fas fa-chevron-down fa-sm" />
              ) : (
                <i class="fas fa-chevron-right fa-sm" />
              )}
            </span>
          </button>
          {isOpen && (
            <ul class=" overflow-hidden absolute mt-2 inset-x-0  bg-white rounded-lg border shadow">
              {options.map(item => {
                return (
                  <li className="" onClick={() => onChangeHandler(item)}>
                    <p class="cursor-pointer text-xs block px-3 py-2 hover:bg-indigo-500 hover:text-white">
                      {item}
                    </p>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
