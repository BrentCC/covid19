

Vue.component('charts', VueECharts)

new Vue({
    el: "#app",

    data () {
        return {
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
                        type: 'value',
                    },
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


            newsDatas: []
        }
    },
    created () {
        onLoad()
        this.getData()

        this.getBarData()
        this.getlineData()
        this.getWorldNews()
    },
    methods: {
        async getWorldNews () {
            await db
                .collection("news")
                .where('country', '==', 'Worldwide')
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
        getData () {
            fetch('https://api.covid19api.com/summary')
                .then(res => res.json())
                .then(res => {
                    this.global = this.globalHandler(res.Global)
                    this.yuan1.series[0].data = this.picDataHandler(res.Global)


                })
        },
        globalHandler (data) {
            data.ActiveCases = data.TotalConfirmed - data.TotalRecovered
            data.RecoveredRate = Math.floor((data.TotalRecovered / data.TotalConfirmed).toFixed(4) * 10000) / 100 + '%'
            data.DeathsRate = Math.floor((data.TotalDeaths / data.TotalConfirmed).toFixed(4) * 10000) / 100 + '%'
            return data
        },

        getPicData () {
            fetch('https://api.covid19api.com/world/total')
                .then(res => res.json())
                .then(res => {
                    this.yuan1.series[0].data = this.picDataHandler(res)
                })
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
            fetch(`https://api.covid19api.com/world?from=${days[0]}&to=${days[days.length - 1]}`)
                .then(res => res.json())
                .then(res => {
                    this.bar1.series[0].data = res.map(it => it.TotalDeaths)
                    this.bar1.series[1].data = res.map(it => it.TotalRecovered)
                    this.bar1.series[2].data = res.map(it => it.NewConfirmed)
                })
        },



        getlineData () {
            var days = []
            var daysLen = dayjs().diff(dayjs('2020-04-12'), 'day')

            for (let index = 0; index < daysLen; index++) {
                var day = dayjs().subtract(index, 'day').format('YYYY-MM-DD')
                days.push(day)
            }
            this.line1.xAxis[0].data = days.reverse()
            fetch(`https://api.covid19api.com/world?from=${days[0]}&to=${days[days.length - 1]}`)
                .then(res => res.json())
                .then(res => {
                    res.sort((a, b) => a.TotalConfirmed - b.TotalConfirmed)
                    this.line1.series[0].data = res.map(it => it.TotalDeaths)
                    this.line1.series[1].data = res.map(it => it.TotalRecovered)
                    this.line1.series[2].data = res.map(it => it.TotalConfirmed)
                })
        },


    },
    computed: {

    },
})