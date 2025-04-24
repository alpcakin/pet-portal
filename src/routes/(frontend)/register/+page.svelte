<script lang="ts">
    let name = '';
    let password = '';
    let message = '';
    let error = '';

    async function handleRegister() {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, password })
        });

        const data = await res.json();
        if (res.ok) {
            message = data.message;
            error = '';
        } else {
            error = data.message;
            message = '';
        }
    }
</script>

<h1>Register</h1>
<form on:submit|preventDefault={handleRegister}>
    <input type="text" bind:value={name} placeholder="Name" />
    <input type="password" bind:value={password} placeholder="Password" />
    <button type="submit">Register</button>
</form>

{#if message}
    <p style="color: green">{message}</p>
{/if}

{#if error}
    <p style="color: red">{error}</p>
{/if}
