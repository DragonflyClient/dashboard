/* redirect when already logged in */
const params = new URLSearchParams(window.location.search);
fetch('https://api.playdragonfly.net/v1/authentication/cookie/token', {
  method: 'POST',
  credentials: 'include',
}).then((res) => {
  res.json().then((res) => {
    if (res.success && location.href.indexOf('/dashboard232/login') > -1) {
      location.href = 'https://playdragonfly.net/dashboard2332';
    } else if (res.success && location.href.indexOf('login') > -1) {
      location.href = params.get('ref') || 'https://playdragonfly.net?pi=pi';
    }
  });
})

/* Set parameter from page before */
if (window.location.href.indexOf('login') > -1) {
  document.getElementById('switch-register').href = `register?ref=${params.get('ref')}`;
} else if (window.location.href.indexOf('register') > -1) {
  document.getElementById('switch-login').href = `login?ref=${params.get('ref')}`;
}

/* redirect back after authentication */
function afterLogin(success, user) {
  localStorage.setItem('user', user);
  console.log(localStorage);
  setTimeout(() => {
    const redirect = params.get('ref') || 'https://playdragonfly.net';
    window.location.href = redirect;
  }, 1500);
}

function logOut() {
  fetch('https://api.playdragonfly.net/v1/authentication/cookie/logout', {
    method: 'POST',
    credentials: 'include',
  }).then((res) => {
    if (res.status === 200) {
      res.json().then((res) => {
        if (res.success) {
          window.location.href =
            'https://playdragonfly.net/dashboard2332/login?ref=https://playdragonfly.net/dashboard2332';
        }
      });
    }
  });
}

function unlinkMinecraftAccount(item) {
  console.log(item.id);
  fetch('https://api.playdragonfly.net/v1/minecraft/cookie/unlink', {
    method: 'POST',
    credentials: 'include',
    body: item.id,
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        window.location.reload();
      } else {
        Swal.fire({
          title: 'Error',
          text: data.error,
          icon: 'error',
        });
      }
    });
}

async function getMinecraftName(uuid) {
  const response = await fetch(`https://api.minetools.eu/uuid/${uuid}`);
  const data = await response.json();
  return data.name;
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
