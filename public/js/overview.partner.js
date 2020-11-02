const selectedIncomeType = document.getElementById('income-type_selected')
const incomeTypeDropdown = document.getElementById('income-type_dropdown')

const incomeType = document.querySelectorAll('.income-type')
if (selectedIncomeType.dataset.selectedIncome == "unlinked") {
    selectedIncomeType.parentElement.setAttribute('disabled', "true"); incomeTypeDropdown.innerHTML = ''
} else {
    incomeType.forEach(type => {
        type.addEventListener('click', setType)
    })
}

async function setType(e) {
    console.log(e.target)
    const el = e.target
    const incomeType = el.dataset.incomeType
    console.log(incomeType)
    const typeResult = await fetch(`https://store.playdragonfly.net/api/ref/type`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type: incomeType })
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
}

const usernameEl = document.getElementById('dragonfly-username')
let dragonflyUser = localStorage.getItem('user') || null