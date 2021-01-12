
var app = new Vue({
    el: "#app",
    data () {
        return {
            form: {
                username: '',
                password: '',
            },

            email: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
        }
    },
    created () {

    },
    methods: {
        async login_fb () {
            var data = this.form;
            if (!data.username || !data.password) {
                alert('Field can\'t  is empty')
                return
            }
            if (!this.email.test(data.username)) {
                alert('The format of the message is not correct')
                return
            }
            var docRef = db.collection("users").doc(data.username)
            var res = await docRef.get()
            console.log('res -> :', res)
            if (!res.exists) {
                alert('User is not registered, Please register user')
                return
            }
            localStorage.setItem('user', JSON.stringify(res.data()))
            location.href = './homepage.html'
        },
        async reg_fb () {
            var data = this.form;
            if (!data.username || !data.password) {
                alert('Field can\'t  is empty')
                return
            }
            if (!this.email.test(data.username)) {
                alert('The format of the message is not correct')
                return
            }
            var docRef = db.collection("users").doc(data.username)
            var res = await docRef.get()
            console.log('res -> :', res)
            if (res.exists) {
                alert('User is exist, Please login')
                return
            }
            db.collection("users").doc(data.username).set({
                name: data.username,
                password: data.password,
            })
                .then(function () {
                    alert('registered successfully')
                    location.href = './login.html'
                })
                .catch(function (error) {
                    console.error("Error writing document: ", error);
                });

        }
    },
    computed: {

    },
})

function signOut () {
    console.log('gapi -> :', gapi)
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(() => {
        console.log('1 -> :', 1)
    })
}

async function onSignIn (googleUser) {
    var profile = googleUser.getBasicProfile();

    if (profile.getEmail()) {
        var data = {
            password: '123456',
            username: profile.getEmail()
        }
        console.log('data -> :', data)

        var docRef = db.collection("users").doc(data.username)
        var res = await docRef.get()
        console.log('res -> :', res)
        if (res.exists) {
            localStorage.setItem('user', JSON.stringify(res.data()))
            location.href = './homepage.html'
            return
        }
        db.collection("users").doc(data.username).set({
            name: data.username,
            password: data.password,
        })
            .then(function () {
                localStorage.setItem('user', JSON.stringify(data))
                location.href = './homepage.html'
            })
            .catch(function (error) {
                console.error("Error writing document: ", error);
            });
    }

}


