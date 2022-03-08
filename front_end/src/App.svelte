<script>
    import { fade, blur, fly, slide, scale } from "svelte/transition";

    import HomePage from "./HomePage.svelte";
    import Navbar from "./Navbar.svelte";
    import Student from './Student.svelte'
    import AboutPage from "./AboutPage.svelte";

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
</script>
{#if urlParams.get("page") == null || urlParams.get("page") == "home"}
    <Navbar page="home"/>
    {#if urlParams.get("id") == null}
        <HomePage/>
    {:else}
        <Student/>
    {/if}
{:else}
    <Navbar page="about"/>
    <AboutPage/>
{/if}