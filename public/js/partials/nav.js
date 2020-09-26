console.log('great')

async function logOut() {
    const result = await fetch('/auth/logout', {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        }
    })
    const data = await result.json()
    if (data.success) window.location.reload()
    console.log(data)
}