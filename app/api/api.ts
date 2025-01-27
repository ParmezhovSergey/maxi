import axios from "axios";

export async function getUsers() {
    try {
        const response = await axios.get("https://jsonplaceholder.typicode.com/users")
        const data = response.data
        return data
    } catch {
        return 'error'
    }
}