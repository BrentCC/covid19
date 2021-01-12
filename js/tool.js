function logout () {
    localStorage.clear();
    signOut()
    location.href = './login.html'
}
isLogin()
function isLogin () {
    var user = localStorage.getItem("user");
    if (!user) {
        location.href = "./login.html";
    }
}

//注销
function signOut () {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(() => {
        console.log('1 -> :', 1)
    })
}

function onLoad () {
    gapi.load('auth2', function () {
        gapi.auth2.init();
        console.log('gapi -> :', gapi)
    });
}

// Vue
Vue.component('logout', {
    template: `
    <p style="text-align: right">
        <button class="btn btn-success" @click="myNew">My News</button>
        <button class="btn btn-info" @click="toNew">Post News</button>
        <button class="btn btn-danger" @click="logout">Logout</button>
      </p>`,
    methods: {
        logout,
        myNew () {
            window.location.href = 'myNews.html'
        },
        async toNew () {
            var isAuth = await db
                .collection("checkUsers")
                .doc(JSON.parse(localStorage.getItem("user")).name)
                .get();

            if (!isAuth.exists) {
                alert(
                    `You DO NOT have permission to post news, please contact Admin <clouds.eurecom@gmail.com>`
                );
                return;
            }
            window.location.href = 'addNew.html'
        }
    },
})
Vue.component('vlink', {
    template: `
    <p style="text-align: center">
        <a style="text-decoration: none" href="./homepage.html">Summary</a>
        |
        <a href="./country.html">Country Details</a>
      </p>`,
})

