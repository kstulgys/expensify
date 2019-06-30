import React from "react"
import ReactDOM from "react-dom"
import DataTable from "./DataTable"
import FilterByText from "./FilterByText"
import { Provider, useTableContext } from "./context"
import ImageSVG from "./imageSVG"
import FilterByFields from "./FilterByFields"
import "./styles.css"

function App() {
  const { state } = useTableContext()
  console.log({ state })
  return (
    <div className="font-mono text-sm bg-gray-200 text-gray-800 min-h-screen py-10">
      <div className="container mx-auto">
        <div className="mt-12 mb-8 md:flex lg:justify-between">
          <div className="flex-grow w-full mx-2 sm:mx-0">
            <FilterByText />
            <FilterByFields />
          </div>
          <ImageSVG />
        </div>
        <DataTable />
      </div>
    </div>
  )
}

const rootElement = document.getElementById("root")
ReactDOM.render(
  <Provider>
    <App />
  </Provider>,
  rootElement
)
