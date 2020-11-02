const cosmeticTransferBtn = document.querySelectorAll('.cosmetic-transfer-btn')

cosmeticTransferBtn.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const cosmeticName = e.target.previousElementSibling.textContent
        const cosmeticQualifier = e.target.parentElement.parentElement.parentElement.dataset.cosmeticQualifier
        console.log(cosmeticQualifier)
        Swal.fire({
            title: 'Give away this cosmetic!',
            html: `Just enter the <b>Dragonfly username</b> of the player who should receive this cosmetic. 
            Please note that we assume no liability should you be scammed or something similar should happen.<br><br><label class="us-none"><input id="swal_checkbox" type="checkbox"> Reset cosmetic configuration</label>`,
            input: 'text',
            inputPlaceholder: 'Username',
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Transfer',
            showLoaderOnConfirm: true,
            preConfirm: (login) => {
                const cosmeticResetCheckbox = document.getElementById('swal_checkbox')
                const bodyData = {
                    cosmeticQualifier: cosmeticQualifier,
                    dragonflyUsername: login,
                    resetConfig: cosmeticResetCheckbox.checked
                }
                return fetch("https://api.playdragonfly.net/v1/cosmetics/transfer", {
                    "method": "POST",
                    "credentials": "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(bodyData)
                }).then(res => res.json())
                    .then(data => {
                        console.log(data)
                        if (!data.success) {
                            throw data.error
                        } else {
                            data.username = login
                            return data
                        }
                    })
                    .catch(error => {
                        Swal.showValidationMessage(
                            error
                        )
                    })
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    icon: 'success',
                    title: 'Great!',
                    html: `You've successfully transferred the cosmetic <b>${cosmeticName}</b> to the Dragonfly account with the name <b>${result.value.username}</b>`,
                    preConfirm: () => {
                        window.location.reload()
                    }
                })
            }
        })
    })
})