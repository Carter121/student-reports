<script>
    import {onMount} from 'svelte';
    import {Chart} from '../node_modules/chart.js/dist/chart.js'

    export let data
    export let title

    let chart

    
    onMount(() => {
        const myChart = new Chart(chart, {
            type: 'bar',
            data: {
                datasets: [{
                    label: 'Data',
                    data: data,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                parsing: {
                    xAxisKey: 'date',
                    yAxisKey: 'value'
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        stacked: false,
                        grouped: false
                    },
                    x: {
                        stacked: false,
                        grouped: false
                    }
                }
            }
        });
    })
</script>

<p class="text-center">{title}</p>
<canvas width="400" height="200" bind:this={chart}></canvas>