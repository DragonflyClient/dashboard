
const logoutBtn = document.getElementById('logout-btn')
logoutBtn.addEventListener('click', async (e) => {
    console.log(e)
    const path = e.target.dataset.path
    const result = await fetch('/auth/logout', {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        }
    })
    const data = await result.json()
    console.log(data)
    if (data.success) window.location.href = `https://playdragonfly.net/login?ref=https://dashboard.playdragonfly.net${path}`
})