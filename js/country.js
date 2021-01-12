
Vue.component('charts', VueECharts)

new Vue({
    el: "#app",

    data () {
        return {
           
            data: [],

        }
    },
    created () {
        onLoad()
        this.getData()
    },
    methods: {
        getData () {
            fetch('https://api.covid19api.com/summary')
                .then(res => res.json())
                .then(res => {
                console.log('res -> :', res)
                    this.data = res.Countries

                })
        },
        sortMethod (obj1, obj2) {
            const val1 = obj1.Country ? 1 : 0
            const val2 = obj2.Country ? 1 : 0
            return val1 - val2
        },


    },
    computed: {

    },
})