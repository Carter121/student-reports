<script>
	export let page
</script>

<nav class="navbar navbar-expand-lg navbar-light bg-light">
	<div class="container-fluid">
		<a class="navbar-brand" href="/">Student Reports</a>
		<button
			class="navbar-toggler"
			type="button"
			data-bs-toggle="collapse"
			data-bs-target="#navbarNavAltMarkup"
			aria-controls="navbarNavAltMarkup"
			aria-expanded="false"
			aria-label="Toggle navigation"
		>
			<span class="navbar-toggler-icon"></span>
		</button>
		<div class="collapse navbar-collapse" id="navbarNavAltMarkup">
			<div class="navbar-nav ms-auto">
				{#if page == "home"}
					<a class="nav-link active" aria-current="page" href="/?page=home">Home</a>
					<a class="nav-link" href="/?page=about">About</a>
				{:else}
					<a class="nav-link" aria-current="page" href="/?page=home">Home</a>
					<a class="nav-link active" href="/?page=about">About</a>
				{/if}
			</div>
		</div>
	</div>
</nav>