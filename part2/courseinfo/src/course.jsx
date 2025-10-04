const Header = ({ name }) => <h1>{name}</h1> 

const Part = ({part})=>( 
    <p>{part.name} {part.exercises}</p>
)

const Content = ({ parts}) => {
    return (
        <div>
        {parts.map ( part =>(
        <Part key = {part.id} part = {part}/>
        ))}
    </div>
    )
}


const Total = ({parts}) =>{
    const total = parts.reduce ((sum,p)=> sum + p.exercises,0)
    return(
    <p><b>Number of exercises {total}</b></p>
    )
}

const Course = ({ course }) => {
    return (
        <div>
        <h2>{course.name}</h2>
        <Content parts={course.parts} />
        <Total parts={course.parts} />
    </div>
    )
}

export default Course