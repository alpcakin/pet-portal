<script lang="ts">
    import { currentUser } from '$lib/stores';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    let name = '';
    let type: 'puppy' | 'kitten' = 'puppy';
    let message = '';
    let error = '';

    $: user = $currentUser;

    onMount(() => {
        if (!user) {
            goto('/login');
        } else if (user.role !== 'admin') {
            goto('/');
        }
    });

    async function addPet() {
        const res = await fetch('/api/pets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, type })
        });

        const data = await res.json();

        if (res.ok) {
            message = data.message;
            error = '';
            name = '';
            type = 'puppy';
        } else {
            message = '';
            error = data.message;
        }
    }
</script>

<h1>Add a New Pet</h1>

{#if message}<p style="color: green;">{message}</p>{/if}
{#if error}<p style="color: red;">{error}</p>{/if}

<form on:submit|preventDefault={addPet}>
    <input type="text" placeholder="Pet name" bind:value={name} required />
    <select bind:value={type}>
        <option value="puppy">Puppy</option>
        <option value="kitten">Kitten</option>
    </select>
    <button type="submit">Add Pet</button>
</form>

<style>
    form {
        display: grid;
        gap: 0.75rem;
        max-width: 300px;
    }
</style>
