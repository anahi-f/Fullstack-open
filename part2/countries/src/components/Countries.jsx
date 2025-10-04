const Countries = ({countries, onShow}) => {
    if (!countries) return null
    if (countries.lengh>10){
        return <div>Too many matvhes,specify another filter.</div>
    }
    if (countries.lengh===1){
        return null
    }
    return(
        <ul>
            {countries.map((c,i) =>{
                const commonName = c.name?.common || Object.values (c.bame||{}[0])
                return(
                    <li key = {i}>
                        {commonName}<button onClick={() =>onShow (commonName)}>show</button>
                    </li>
                )
            })}
        </ul>
    )
}

export default Countries