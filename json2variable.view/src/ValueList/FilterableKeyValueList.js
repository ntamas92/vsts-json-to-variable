import React, { useEffect, useState } from "react";
import "./FilterableKeyValueList.css"

const FilterableKeyValueList = ({values}) => {
    const [filter, setFilter] = useState(null)

    return (
        <div className="merged-container">
            <label >Filter:</label>
            <input type="text" onChange={e => setFilter(e.target.value)} />

            {values && Object.keys(values)
                             .filter(x => !filter || x.toLowerCase().includes(filter.toLowerCase()))
                             .map(k => (<li title={values[k]} className="merged-content"><b>{k}</b> :: {values[k]}</li>))}
        </div>
    )
}

export default FilterableKeyValueList