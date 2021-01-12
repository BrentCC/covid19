new Vue({
    el: "#app",
    data () {
        return {
            data: [],
            userName: JSON.parse(localStorage.getItem("user")).name,

        }
    },
    created () {
        onLoad()
        this.getMyNews()
    },
    methods: {
        async getMyNews () {
            await db
                .collection("news")
                .where('userName', '==', this.userName)
                .get()
                .then((data) => {
                    var newData = []
                    data.forEach(res => {
                        newData.push({
                            id: res.id,
                            ...res.data()
                        })
                    })
                    var mydata = newData.map(it => ({ ...it, time: dayjs(it.date).valueOf() })).sort((a, b) => b.time - a.time)
                    this.data = mydata
                })

        },
        edit (row) {
            location.href = './addNew.html?id=' + row.id
        },
        del (row) {
            if (confirm(`Do you want to delete news`)) {
                db.collection("news").doc(row.id).delete().then(() => {
                    this.getMyNews()
                }).catch((error) => {
                    console.error("Error removing document: ", error);
                });
            }
        }
    },
    computed: {

    },
})