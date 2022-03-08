<script>
    export let type;
    export let name;
    export let questionId;
    export let number;

    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    function deleteQuestion() {
        dispatch('deleteQuestion',{
            id: questionId
        })
    }
    let score = ''
    let textData = ''
    function setScore() {
        if(type == "Multi Choice") {
            dispatch('setScore', {
                index: number,
                data: score,
            })
        } else {
            dispatch('setScore', {
                index: number,
                data: textData,
            })
        }
        
    }
</script>

        <div class="modal fade deleteQuestionModal" id="delQuestionModal{number}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Confirm Delete Question</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-danger" id="del-student-{number}" data-bs-dismiss="modal" on:click={() => deleteQuestion()}>Delete</button>
                </div>
                </div>
            </div>
        </div>

    {#if type === 'Text'}
        <div class="card newQuestion" style="width: 100%">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                    <h5 class="card-title">{name}</h5>
                    <button class="btn btn-danger delete-new-question" style="transform: scale(0.75)" data-bs-toggle="modal" data-bs-target="#delQuestionModal{number}">Delete</button>
                </div>
                    <input type="text" id="text-input" class="form-control text-input" bind:value={textData} on:input={setScore}>
            </div>
        </div>
    {:else if type === 'Multi Choice'}
        <div class="card newQuestion" style="width: 100%">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                    <h5 class="card-title">{name}</h5>
                    <button class="btn btn-danger delete-new-question" style="transform: scale(0.75)" data-bs-toggle="modal" data-bs-target="#delQuestionModal{number}">Delete</button>
                </div>
                    <div class="d-flex justify-content-evenly">
                        <div>
                            <input type="radio" name="{questionId}-radio-btns" value="0" id="{questionId}-radio-btns-0" class="form-label" on:click={() => {score = 0; setScore()}}>
                            <label for="{questionId}-radio-btns-0">0</label>
                        </div>
                        <div>
                            <input type="radio" name="{questionId}-radio-btns" value="1" id="{questionId}-radio-btns-1" class="form-label" on:click={() => {score = 1; setScore()}}>
                            <label for="{questionId}-radio-btns-1">1</label>
                        </div>
                        <div>
                            <input type="radio" name="{questionId}-radio-btns" value="2" id="{questionId}-radio-btns-2" class="form-label" on:click={() => {score = 2; setScore()}}>
                            <label for="{questionId}-radio-btns-2">2</label>
                        </div>
                        <div>
                            <input type="radio" name="{questionId}-radio-btns" value="3" id="{questionId}-radio-btns-3" class="form-label" on:click={() => {score = 3; setScore()}}>
                            <label for="{questionId}-radio-btns-3">3</label>
                        </div>
                        <div>
                            <input type="radio" name="{questionId}-radio-btns" value="4" id="{questionId}-radio-btns-4" class="form-label" on:click={() => {score = 4; setScore()}}>
                            <label for="{questionId}-radio-btns-4">4</label>
                        </div>
                    </div>
            </div>
        </div>
    {/if}