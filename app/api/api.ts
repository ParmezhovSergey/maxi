import axios from "axios";

export async function getUsers() {
    try {
        const response = await axios.get("https://jsonplaceholder.typicode.com/users")
        const data = response.data
        console.log('res', response)
        return data
    } catch (e) {
        return 'error'
    }
}