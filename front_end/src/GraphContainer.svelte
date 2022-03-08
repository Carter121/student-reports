<script>
    import {onMount} from 'svelte';
    import Graph from './Graph.svelte';

    import { each } from 'svelte/internal';

    //* Url params
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    //* API URL
    let url;

    async function getURL() {
        let output
        await fetch("/config.json")
            .then((response) => response.json())
            .then((data) => {
                output = data
            })
        return output.url
    }

    let studentId = urlParams.get("id")

    async function getStudents() {
        let output;
        await fetch(url + `/${studentId}`)
            .then((response) => response.json())
            .then((data) => {
                output = data;
        })
        return output
    }

    let data = []
    let graphData = []
    let keys = []
    onMount(async () => {
        url = await getURL()
        data = await getStudents()
        data = data.scores
        graphData = formatData(data)
        //* Get keys
        for(let i = 0; i < data.length; i++) {
            for(let j = 0; j < Object.keys(data[i]).length; j++) {
                if(keys.indexOf(Object.keys(data[i])[j]) == -1) {
                    keys.push(Object.keys(data[i])[j])
                } 
            }
        }
        keys = reduceKeys(keys)
    });

    //* Format the data in a way that chartjs can read it
    function formatData(input) {
        const outputByExercise = {};
        for (const item of input) {
            const { Comment, date, email, ...rest } = item;
            for (const [key, value] of Object.entries(rest)) {
                outputByExercise[key] ??= [];
                outputByExercise[key].push({ date, value });
            }
        }
        let output = Object.values(outputByExercise);
        output = formatEvenMore(output)
        return output
    }

    function formatEvenMore(input) {
        let output = []
        for(let i = 0; i < input.length; i++) {
            if(typeof input[i][0].value == "string") continue
            output.push(input[i])
        }
        return output
    }

    function reduceKeys(keyArr) {
        let output = []
        for(let i = 0; i < keyArr.length; i++) {
            let key = keyArr[i]
            if(key.toLowerCase().includes("comment") || key.toLowerCase().includes("date") || key.toLowerCase().includes("email")) continue
            output.push(key)
        }
        return output
    }
</script>

{#each graphData as data, i}
    <div class="mb-5 container">
        <Graph data={data} title={keys[i]}/>
    </div>
{/each}
