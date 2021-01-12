
Vue.component('charts', VueECharts)

var getURLParameters = url =>
    (url.match(/([^?=&]+)(=([^&]*))/g) || []).reduce(
        (a, v) => ((a[v.slice(0, v.indexOf('='))] = v.slice(v.indexOf('=') + 1)), a),
        {}
    );


new Vue({
    el: "#app",

    data () {
        return {
            name: decodeURIComponent(getURLParameters(window.location.href).name),
            slug: decodeURIComponent(getURLParameters(window.location.href).slug),

            yuan1: {
                color: ['#ffeb3b', '#87c7f3', '#ed97ab'],
                legend: {},
                tooltip: {},
                series: [
                    {
                        type: 'pie',
                        radius: 120,
                        data: []
                    }
                ]
            },
            bar1: {
                color: ['#ed97ab', '#87c7f3', '#ffeb3b',],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        crossStyle: {
                            color: '#999'
                        }
                    }
                },
                legend: {
                    data: ['Deaths', 'Recovered', 'New Cases']
                },
                xAxis: [
                    {
                        type: 'category',
                        data: []
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: 'Deaths',
                        type: 'bar',
                        data: []
                    },
                    {
                        name: 'Recovered',
                        type: 'bar',
                        data: []
                    },
                    {
                        name: 'New Cases',
                        type: 'bar',
                        data: []
                    },
                ]
            },
            line1: {
                color: ['#ed97ab', '#87c7f3', '#ffeb3b',],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                legend: {
                    data: ['Total Deaths', 'Total Recovered', 'Total Cases']
                },
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: [],
                        axisLabel: {
                            rotate: 40
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: 'Total Deaths',
                        type: 'line',
                        areaStyle: {},
                        data: []
                    },
                    {
                        name: 'Total Recovered',
                        type: 'line',
                        areaStyle: {},
                        data: []
                    },
                    {
                        name: 'Total Cases',
                        type: 'line',
                        areaStyle: {},
                        data: []
                    },


                ]
            },

            data: [],

            global: [],
            newsDatas: [],
        }
    },
    created () {
        onLoad()
        this.getFBData()

        this.getBarData()
        this.getlineData()
        this.getWorldNews()
    },
    methods: {
        async getWorldNews () {
            await db
                .collection("news")
                .where('country', '==', this.name)
                .get()
                .then((data) => {
                    var newData = [];
                    data.forEach(res => {
                        newData.push({
                            id: res.id,
                            ...res.data()
                        })
                    })
                    var mydata = newData.map(it => ({ ...it, time: dayjs(it.date).valueOf() })).sort((a, b) => b.time - a.time)
                    this.newsDatas = mydata
                })
        },
        async getFBData () {
            var docRef = db.collection("countries").doc(this.slug)
            var res = await docRef.get()
            if (!res.exists) {
                this.getData()
            } else {
                var data = res.data()
                console.log('data -> :', data)
                if (dayjs(data.Date).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')) {
                    this.global = this.globalHandler(data)
                    this.yuan1.series[0].data = this.picDataHandler(data)
                } else {
                    this.getData()
                }
            }
        },

        getData () {
            fetch('https://api.covid19api.com/summary')
                .then(res => res.json())
                .then(res => {
                    var data = res.Countries.find(it => it.Country === this.name)
                    this.global = this.globalHandler(data)

                    this.yuan1.series[0].data = this.picDataHandler(data)
                    db.collection("countries").doc(this.name).set(data)
                })
        },
        globalHandler (data) {
            data.ActiveCases = data.TotalConfirmed - data.TotalRecovered
            data.RecoveredRate = data.TotalRecovered ? Math.floor((data.TotalRecovered / data.TotalConfirmed).toFixed(4) * 10000) / 100 + '%' : '0%'
            data.DeathsRate = data.TotalDeaths ? Math.floor((data.TotalDeaths / data.TotalConfirmed).toFixed(4) * 10000) / 100 + '%' : '0%'
            return data
        },
        picDataHandler (data) {
            var a = {
                TotalConfirmed: data.TotalConfirmed,
                TotalRecovered: data.TotalRecovered,
                TotalDeaths: data.TotalDeaths,
            }
            let arr = [];
            Object.keys(a).forEach(v => {
                let o = {};
                o.name = v
                o.value = a[v]
                arr.push(o)
            })
            return arr
        },


        getBarData () {
            var days = []
            for (let index = 0; index < 8; index++) {
                var day = dayjs().subtract(index, 'day').format('YYYY-MM-DD')
                days.push(day)
            }
            this.bar1.xAxis[0].data = days.reverse()
            fetch(`https://api.covid19api.com/country/${this.slug}?from=${days[0]}&to=${days[days.length - 1]}`)
                .then(res => res.json())
                .then(res => {
                    this.bar1.series[0].data = res.map(it => it.Deaths)
                    this.bar1.series[1].data = res.map(it => it.Recovered)
                    this.bar1.series[2].data = res.map(it => it.Confirmed)
                    console.log('this.bar1 -> :', this.bar1)
                })
        },



        getlineData () {
            fetch(`https://api.covid19api.com/total/dayone/country/${this.slug}`)
                .then(res => res.json())
                .then(res => {
                    this.line1.xAxis[0].data = res.map(it => dayjs(it.Date).format('YYYY-MM-DD'))

                    this.line1.series[0].data = res.map(it => it.Deaths)
                    this.line1.series[1].data = res.map(it => it.Recovered)
                    this.line1.series[2].data = res.map(it => it.Confirmed)
                })
        },

    },
    computed: {

    },
})