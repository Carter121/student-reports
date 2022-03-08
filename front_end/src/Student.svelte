<script>
    import GoalInput from './GoalInput.svelte';

    import {onMount} from 'svelte';
    import GraphContainer from './GraphContainer.svelte';

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

    //* Parent Email
    let parentEmail;

    let students

    async function saveEdit() {
        //* inputs
        const editStudentName = document.getElementById("edit-student-name")
        const editParentEmail = document.getElementById("edit-parent-email")
        const editTeacher = document.getElementById("edit-teacher")

        let editedStudent = {
            name: editStudentName.value,
            parentEmail: editParentEmail.value,
            teacher: editTeacher.value,
        }

        const options = {
        method: 'PATCH',
        body: JSON.stringify(editedStudent),
        headers: {
                'Content-Type': 'application/json'
            }
        }

        await fetch(url + `/${studentId}`, options)
        .then(res => res.json())
    }

    onMount(async () => {
        url = await getURL()
        students = await getStudents()
    })

</script>

<a href="../" class="btn btn-danger m-2">Back</a>
<div class="text-center">
    {#if students == undefined}
        <h2 class="mt-4" id="title">Loading...</h2>
        <h4 id="parent-email-el">Loading...</h4>
        <h4 id="teacher-name">Loading...</h4>
    {:else}
        <h2 class="mt-4" id="title">{students.name}</h2>
    <h4 id="parent-email-el">{students.parentEmail}</h4>
    <h4 id="teacher-name">{students.teacher}</h4>
    {/if}
    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#editModal">
    Edit Student
    </button>

    <!-- Edit student modal -->
    <div class="modal fade" id="editModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Edit Student</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body d-flex flex-column">
                <div class="d-flex flex-column">
                    <label for="edit-student-name">Student Name</label>
                    {#if students == undefined}
                        <input type="text" id="edit-student-name" placeholder="John Doe" autocomplete="off">
                    {:else}
                        <input type="text" id="edit-student-name" placeholder="John Doe" autocomplete="off" value={students.name}>
                    {/if}
                </div>
                <div class="d-flex flex-column">
                    <label for="edit-parent-email">Parent Email</label>
                    {#if students == undefined}
                        <input type="email" id="edit-parent-email" placeholder="john.doe@example.com" autocomplete="off">
                    {:else}
                        <input type="email" id="edit-parent-email" placeholder="john.doe@example.com" autocomplete="off" value={students.parentEmail}>
                    {/if}
                </div>
                <div class="d-flex flex-column">
                    <label for="edit-teacher">Teacher</label>
                    {#if students == undefined}
                        <input type="text" id="edit-teacher" placeholder="Mr. Doe" autocomplete="off">
                    {:else}
                        <input type="text" id="edit-teacher" placeholder="Mr. Doe" autocomplete="off" value={students.teacher}>
                    {/if}
                </div>
            </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-success" id="save-student" data-bs-dismiss="modal" on:click={() => saveEdit()}>Save</button>
                </div>
            </div>
        </div>
    </div>
</div>

<GoalInput/>

<GraphContainer/>