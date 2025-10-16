import { data } from "react-router";

export async function loader() {
    return data({
        test: 'test'
    })
}