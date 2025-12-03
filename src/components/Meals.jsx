import MealItem from "./MealItem";
import useHttp from "../hooks/useHttp";
import Error from "./Error";

const requestConfig = {}

export default function Meals() {

    const { data: loadedMeals, isLoading, error } = useHttp('http://localhost:5050/meals', requestConfig, [])

    if (isLoading) {
        retrun(
            <p className="center">Loading meals...</p>
        )
    }

    if (error) {
        return (
            <Error title="Failed to load meals" message={error} />
        )
    }

    return (
        <ul id="meals">
            {loadedMeals.map((meal) => (
                <MealItem key={meal.id} meal={meal} />
            ))}
        </ul>
    )
}