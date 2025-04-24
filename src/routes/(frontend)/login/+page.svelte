<script lang="ts">
    import { goto } from '$app/navigation';
    import {currentUser} from "$lib/stores";
    let name = '';
    let password = '';
    let error = '';

    async function handleLogin() {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, password })
        });
        const data = await res.json();

        if (res.ok) {
            localStorage.setItem('user', JSON.stringify(data.user));
            currentUser.set(data.user);
            goto('/dashboard');
        } else {
            error = data.message;
        }
    }
</script>

<h1>Login</h1>
<form on:submit|preventDefault={handleLogin}>
    <input type="text" placeholder="Name" bind:value={name} />
    <input type="password" placeholder="Password" bind:value={password} />
    <button type="submit">Login</button>
</form>

{#if error}
    <p style="color: red">{error}</p>
{/if}