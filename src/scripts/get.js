export default function sendRequest(url) {
    return fetch(url)
        .then(response => {
            return response.json()
        })
}


