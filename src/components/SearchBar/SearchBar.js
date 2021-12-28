import React, { useContext, useState } from 'react'
import { NavigatorContext } from '../../context/Navigator';


const SearchBar = ({ print, setInput, input }) => {

  const { navigator, navigatorDispatch } = useContext(NavigatorContext)


  const changeInput = (e) => {
    setInput(e.target.value)
  }



  return (
    <div className="px-4 pt-4" style={((navigator.selected === "others") && (input === "")) ? { marginTop: "150px" } : {}}>
      <div className="d-flex align-items-start">
        <div className="flex-grow-1"><h4 className="mb-4">{print}</h4></div>
      </div>
        <div className="input-group mb-3">
          <input
            value={input}
            onChange={changeInput}
            type="text"
            className="form-control bg-light border-0 pe-0"
            placeholder="Search here.."
            aria-label="Example text with button addon"
          />
        </div>
    </div>
  )
}

export default SearchBar