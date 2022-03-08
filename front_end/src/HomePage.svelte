<script>
  import { fade, blur, fly, slide, scale } from "svelte/transition";

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

    import {onMount} from 'svelte';
    import { each } from 'svelte/internal';

    async function getStudents() {
      let output;
      await fetch(url)
        .then((response) => response.json())
        .then((data) => {
          output = data;
      })
      return output
    }

    //* List of students to display
    let studentsArray = []

    //* Current ID of student to delete
    let currentId = 0

    //* Delete Student Function
      function deleteStudent(id) {
        currentId = id
      }
      const delOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
          }

        async function delStudent() {
          await fetch(url + `/${currentId}`, delOptions)
              .then(res => res.json())

              studentsArray = await getStudents()
          }

    let studentToDelete

    let studentNameInput
    let parentEmailInput
    let teacherInput

    let areFull = false;
    function checkIfFull() {
      if (studentNameInput.value != "" && parentEmailInput.value != "" && teacherInput.value != "") {
        areFull = true
      } else {
        areFull = false
      }
    }

    async function addStudent() {
        const errorLable = document.getElementById("error-lable")

        //* When the save button is clicked then check if all values have stuff in them
        //* Then post the data to the server
        
          if(!areFull) {
            errorLable.style.opacity = 1;
            setTimeout(() => {
              errorLable.style.opacity = 0;
            }, 5000)
          } else if(areFull) {
            const newStudent = {
              name: studentNameInput.value,
              parentEmail: parentEmailInput.value,
              teacher: teacherInput.value,
            }

            const options = {
              method: 'POST',
              body: JSON.stringify(newStudent),
              headers: {
                  'Content-Type': 'application/json'
              }
            }

            await fetch(url, options)
            .then(res => res.json())
            // .then(res => console.log(res))
            // .then(() => displayStudents())

            studentNameInput.value = "";
            parentEmailInput.value = "";
            teacherInput.value = "";

            studentsArray = await getStudents()
          }
    }


    //* Wait until elements are loaded
    onMount(async () => {
      url = await getURL()
      studentsArray = await getStudents()

      //* Element for add student modal
      studentNameInput = document.querySelector('#student-name')
      parentEmailInput = document.querySelector('#parent-email')
      teacherInput = document.querySelector('#teacher')
    })
</script>

<div class="main-page">
  <h2 class="text-center mt-4">Students</h2>

  <!-- Button trigger modal -->
  <div class="d-flex justify-content-center">
      <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">Add Student</button>
  </div>


  <!-- Add Student Modal -->
  <div class="modal fade addStudentModal" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Add Student</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body d-flex flex-column">
          <h6 class="text-center text-danger fw-bold" id="error-lable" style="opacity: 0;">Please fill in all inputs</h6>
          <div class="d-flex flex-column">
              <label for="student-name">Student Name</label>
              <input type="text" id="student-name" placeholder="John Doe" autocomplete="off" on:input={() => checkIfFull()}>
          </div>
          <div class="d-flex flex-column">
              <label for="parent-email">Parent Email</label>
              <input type="email" id="parent-email" placeholder="john.doe@example.com" autocomplete="off" on:input={() => checkIfFull()}>
          </div>
          <div class="d-flex flex-column">
              <label for="teacher">Teacher</label>
              <input type="text" id="teacher" placeholder="Mr. Doe" autocomplete="off" on:input={() => checkIfFull()}>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          {#if areFull == true}
            <button type="button" class="btn btn-primary" id="add-student" on:click={() => addStudent()} data-bs-dismiss="modal">Add Student</button>
          {:else}
            <button type="button" class="btn btn-primary" id="add-student" on:click={() => addStudent()}>Add Student</button>
          {/if}
        </div>
      </div>
    </div>
  </div>

  <!-- Del Student Modal -->
  <div class="modal fade" id="delModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Confirm Delete Student</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-danger" id="del-student" data-bs-dismiss="modal" on:click={() => {delStudent()}}>Delete</button>
        </div>
      </div>
    </div>
  </div>


  <div class="d-flex flex-wrap justify-content-center gap-3 m-5" id="student-container" >
    {#if studentsArray.length < 0}
      Loading...
    {:else}
      {#each studentsArray as student}
        <div class="card" style="width: 15rem;" transition:fade={{duration: 300}}>
            <div class="card-body text-center">
                <h5 class="card-title">{student.name}<br>Teacher: {student.teacher}</h5>
                <div class="d-flex justify-content-evenly">
                  <a href="./?id={student._id}" class="btn btn-success" role="button">Open</a>
                  <a href="#main" class="btn btn-danger delete-btn" role="button" data-bs-toggle="modal" data-bs-target="#delModal" on:click={() => {deleteStudent(student._id)}}>Delete</a>
                </div>
            </div>
        </div>
      {/each}
    {/if}
  </div>
</div>