<script>
    import Question from './Question.svelte';
    
    import {onMount} from 'svelte';

    //* Student Object
        let students

    //* Questions
        let questions = []

    //* Scores
        let scores = []

    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    async function update() {
        students = await getStudents()
        loadQuestions()
        dispatch('update')
    }

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

    let email

    async function getEmail() {
        let output
        await fetch("/config.json")
            .then((response) => response.json())
            .then((data) => {
                output = data
            })
        return output.yourEmail
    }

    //* URL Params
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    let studentId = urlParams.get("id")

    //* Get Students
        async function getStudents() {
            let output;
            await fetch(url + `/${studentId}`)
                .then((response) => response.json())
                .then((data) => {
                    output = data;
            })
            return output
        }

    //* Get Current Date
        function getDate() {
            const date = new Date;
            date.getDate()
            const currentYear = date.getFullYear()
            let currentMonth = date.getMonth() + 1
            let currentDay = date.getDate()

            if(currentMonth < 10) currentMonth = "0" + currentMonth
            if(currentDay < 10) currentDay = "0" + currentDay

            return `${currentYear}-${currentMonth}-${currentDay}`
        }

    //* Add Question
        let newNameInput = ""
        let typeSelectEl = "Multi Choice"

        async function addNewQuestion() {
            questions = [...questions, {
                type: typeSelectEl,
                name: newNameInput
            }]
            const newQuestion = {
                goals: [...students.goals, {
                    type: typeSelectEl,
                    name: newNameInput
                }]
            }

            const options = {
                method: 'PATCH',
                body: JSON.stringify(newQuestion),
                headers: {
                        'Content-Type': 'application/json'
                    }
                }

            await fetch(url + `/${studentId}`, options)
                .then(res => res.json())
                // .then(res => console.log(res))

                students = await getStudents()

                newNameInput = ""
                typeSelectEl = "Multi Choice"

                loadQuestions()
        }

    //* Load Questions
    function loadQuestions() {
        questions = students.goals;
    }

    //* Load stuff when page loads
    onMount(async () => {
        url = await getURL()
        students = await getStudents()
        email = await getEmail()
        loadQuestions()
});

    function deleteQuestion(event) {
        for(let i = 0; i < students.goals.length; i++) {
                if(students.goals[i]["_id"] == event.detail.id) {
                    students.goals.splice(i, 1)
                    scores.splice(i, 1)
                    delQuestion()
                }
            }

        async function delQuestion() {
                const newQuestion = {
                    goals: [...students.goals]
                }
                const options = {
                method: 'PATCH',
                body: JSON.stringify(newQuestion),
                headers: {
                        'Content-Type': 'application/json'
                    }
                }

                await fetch(url + `/${studentId}`, options)
                .then(res => res.json())

                students = await getStudents()
                loadQuestions()
            }
    }

    function setScore(event) {
        let index = event.detail.index
        let data = event.detail.data
        scores[index] = data
        checkIfAllScoresIn()
    }

    let areScoresIn = false
    function checkIfAllScoresIn() {
        if(scores.length != questions.length && questions.length > 0) {areScoresIn = false; return}

        for(let i = 0; i < scores.length; i++) {
            if(scores[i] == null || scores[i] == undefined) {
                areScoresIn = false
                return
            }
        }
        areScoresIn = true
    }

    //* Submit
    let emailSelected = ""
    let date = getDate()
    let sucess = false
    let showPopup = false
    async function submit() {
        if(emailSelected == "") {
            emailSelected = students.parentEmail
        }
        let newScore = {}
        
        let scoreKeys = []
        for(let i = 0; i < students.goals.length; i++) {
            scoreKeys.push(students.goals[i].name)
        }
        for(let i = 0; i < scores.length; i++) {
            newScore[scoreKeys[i]] = scores[i]
        }
        newScore.date = date
        newScore.email = emailSelected

        //* Add score to database
        let dbScores = {
            scores: [...students.scores, newScore]
        }
        const options = {
            method: 'PATCH',
            body: JSON.stringify(dbScores),
            headers: {
                    'Content-Type': 'application/json'
                }
        }
        let response = {}
        await fetch(url + `/${studentId}`, options)
        .then((res) => response = res)
        .then(res => res.json())
        // .then(res => console.log(res))

        students = await getStudents()
        loadQuestions()

        if(response.status == 200) {
            sucess = true
            showPopup = true
            setTimeout(() => {
                showPopup = false
                sucess = false
            }, 2500);
        } else {
            sucess = false
            showPopup = true
            setTimeout(() => {
                showPopup = false
                sucess = false
            }, 2500);
        }

        let checked = document.querySelectorAll("input:checked")
        for(let i = 1; i < checked.length; i++) {
            checked[i].checked = false
        }
        let textInputs = document.querySelectorAll("#text-input")
        for(let i = 0; i < textInputs.length; i++) {
            textInputs[i].value = null
        }

        scores = []
        checkIfAllScoresIn()
    }
</script>

{#if showPopup == true}
    {#if sucess == true}
        <div class="semi-transprent position-fixed d-flex h-100 w-100 justify-content-center align-items-center" style="background-color: rgba(0,0,0,0.4); z-index: 10; top:0; left: 0;">
            <div class="h-25 w-25 rounded d-flex justify-content-center align-items-center flex-column" style="background-color: white;">
                <p class="h2 text-center mt-5">Sucess</p>
                <div class="d-flex justify-content-center align-items-center h-100">
                    <img class="h-50" src="./images/icons8-check-circle.svg" alt="Check Mark">
                </div>
            </div>
        </div>
    {:else}
        <div class="semi-transprent position-fixed d-flex h-100 w-100 justify-content-center align-items-center" style="background-color: rgba(0,0,0,0.4); z-index: 10; top:0; left: 0;">
            <div class="h-25 w-25 rounded d-flex justify-content-center align-items-center flex-column" style="background-color: white;">
                <p class="h2 text-center mt-5">Error</p>
                <div class="d-flex justify-content-center align-items-center h-100">
                    <img class="h-50" src="./images/icons8-cancel.svg" alt="Error X">
                </div>
            </div>
        </div>
    {/if}
{/if}

<div class="container">
    <div class="d-flex align-items-center flex-column gap-4 mt-5">
        <div class="card" style="width: 100%">
            <div class="card-body">
                <h5 class="card-title">Email</h5>
                <div>
                    {#if students == null}
                        <input type="radio" name="email" id="email-parent" checked value="">
                        <label for="email-parent" class="form-label">Loading...</label>
                    {:else}
                        <input type="radio" name="email" id="email-parent" checked value="{students.parentEmail}" on:click={() => emailSelected = students.parentEmail}>
                        <label for="email-parent" class="form-label">{students.parentEmail}</label>
                    {/if}
                </div>
                <div>
                    <input type="radio" name="email" id="email-self" value={email} on:click={() => emailSelected = email}>
                    <label for="email-self" class="form-label">{email}</label>
                </div>
            </div>
        </div>

        <div class="card" style="width: 100%">
            <div class="card-body">
                <h5 class="card-title">Date</h5>
                <div>
                    <input class="form-control" type="date" name="date" id="date" bind:value={date}>
                </div>
            </div>
        </div>
        

            <div class="d-flex align-items-center flex-column gap-4" style="width: 100%">
                {#each questions as question, i}
                    <Question number={i} type={question.type} name={question.name} questionId={question._id} on:deleteQuestion={deleteQuestion} on:setScore={setScore}/>
                {/each}
            </div>


        <div class="card" style="width: 100%">
            <div class="card-body">
                <h5 class="card-title text-center">New</h5>
                <div>
                    <label for="new-name" class="form-label">Name</label>
                    <input type="text" id="new-name" class="form-control new-name-input" placeholder="Rasie Hand" autocomplete="off" bind:value={newNameInput}>
                </div>
                <div>
                    <label for="type-datalist" class="form-label">Type</label>
                    <select class="form-control" id="type-select" placeholder="Choose Type" bind:value={typeSelectEl}>
                        <option value="Multi Choice" id="multiChoiceOption">Multi Choice</option>
                        <option value="Text" id="textOption">Text - Note: Name must contain 'comment'</option>
                    </select>
                </div>
                {#if newNameInput == undefined || newNameInput == ""}
                    <button class="btn btn-primary mt-2" style="width: 100%;" disabled>Add</button>
                {:else}
                    <button class="btn btn-primary mt-2" style="width: 100%;" id="addNewBtn" on:click={() => addNewQuestion()}>Add</button>
                {/if}
            </div>
        </div>

        <div class="card mb-5" style="width: 100%">
            <div class="card-body">
                {#if questions.length > 0}
                    {#if areScoresIn == true}
                        <button class="btn btn-success mt-2" style="width: 100%;" id="addNewBtn" on:click={submit}>Submit</button>
                    {:else}
                        <h6 class="text-danger fw-bold text-center question-warning">Please Input Answers</h6>
                        <button class="btn btn-success mt-2" style="width: 100%;" id="addNewBtn" disabled>Submit</button>
                    {/if}
                {/if}
            </div>
        </div>
    </div>
</div>