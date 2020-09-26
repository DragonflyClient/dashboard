const usernameEl = document.getElementById('dragonfly-username')
let dragonflyUser = localStorage.getItem('user') || null

revenueDetails()

fetch('https://api.playdragonfly.net/v1/authentication/cookie/token', {
    method: 'POST',
    credentials: 'include',
}).then((res) => {
    if (res.status === 200) {
        res.json().then(async (res) => {
            if (res.success) {
                localStorage.setItem('user', res.username)

                if (dragonflyUser !== res.username)
                    dragonflyUser = res.username
            }
        })
    } else {
        console.log(res)
    }
})

usernameEl.innerText = dragonflyUser

const selectedIncomeType = document.getElementById('income-type_selected')
const incomeTypeDropdown = document.getElementById('income-type_dropdown')

const revenueValue = document.getElementById('partner-revenue_value')
const refTypes = ['discount', 'bonus']

async function revenueDetails() {
    const revenueInformation = await fetch('https://store.playdragonfly.net/api/ref/info', {
        method: 'GET',
        credentials: 'include'
    })
    const revenueData = await revenueInformation.json()
    console.log(revenueData)

    let leftRefs = [];
    refTypes.forEach(function (item, index, array) {
        if (item !== revenueData.type) {
            leftRefs.push(item)
        } else {
            selectedIncomeType.innerText = item
            console.log(item, "IT")
        }
    })
    const discountNote = document.getElementById('partner-revenue_discount-note')
    console.log(revenueData.type == "discount")
    if (revenueData.type == "discount") discountNote.style.display = 'block'
    leftRefs.forEach((item, index, array) => {
        incomeTypeDropdown.innerHTML += `<a class="dropdown-item income-type" data-income-type="${item}" href="#">${item}</a>`
        const incomeType = document.querySelectorAll('.income-type')

        console.log(incomeType)
        incomeType.forEach(type => {
            type.addEventListener('click', async (e) => {
                const incomeTypeValue = e.target.dataset.incomeType
                const typeResult = await fetch(`https://store.playdragonfly.net/api/ref/type`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ type: incomeTypeValue })
                })
                const data = await typeResult.json()
                console.log(data)
                if (data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Nice one!',
                        text: `Income type successfully changed to "${data.type}"`,
                        preConfirm: () => {
                            window.location.reload()
                        }
                    })
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Whoops',
                        text: data.message || "Something went wrong. Please try again later."
                    })
                }
            })
        });
    })

    const partnerIncomeTypeBtn = document.getElementById('partner-income-type-btn')
    const partnerRevenueWrapper = document.getElementById('partner-revenue_wrapper')
    console.log(revenueValue)
    if (revenueData.success) {
        revenueValue.innerText = (revenueData.amount).toFixed(2)
    }
    else {
        partnerIncomeTypeBtn.setAttribute('disabled', "true")
        partnerIncomeTypeBtn.title = revenueData.message
        console.log(revenueData.message != `Your account is not connected with a ref link.`)
        if (revenueData.message === "Your account is not connected with a ref link.")
            partnerRevenueWrapper.innerHTML = `<span>${revenueData.message} <a href='/'>More information.</a></span>`
        else partnerRevenueWrapper.innerHTML = revenueData.message
    }
}
