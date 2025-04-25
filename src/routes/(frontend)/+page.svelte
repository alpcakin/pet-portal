<script lang="ts">
    import { onMount } from 'svelte';
    import { currentUser } from '$lib/stores';
    import type { Pet } from '$lib/types';

    let pets: Pet[] = [];
    let petType: '' | 'puppy' | 'kitten' = '';
    let error = '';
    let message = '';

    $: user = $currentUser;

    async function loadPets() {
        const res = await fetch(`/api/pets${petType ? `?type=${petType}` : ''}`);
        pets = await res.json();
    }

    async function adoptPet(petId: number) {
        if (!user) {
            error = 'You must be logged in to adopt.';
            return;
        }

        const res = await fetch('/api/adopt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id, petId })
        });
        const data = await res.json();

        if (res.ok) {
            message = data.message;
            error = '';

            const userRes = await fetch('/api/auth/user?id=' + user.id);
            const updatedUser = await userRes.json();
            localStorage.setItem('user', JSON.stringify(updatedUser));
            currentUser.set(updatedUser);

            loadPets();
        } else {
            error = data.message;
            message = '';
        }
    }


    onMount(loadPets);
</script>

<h1>Browse Adoptable Pets</h1>

{#if message}
    <p style="color: green">{message}</p>
{/if}
{#if error}
    <p style="color: red">{error}</p>
{/if}

<label>
    Filter by type:
    <select bind:value={petType} on:change={loadPets}>
        <option value=''>All</option>
        <option value='puppy'>Puppy</option>
        <option value='kitten'>Kitten</option>
    </select>
</label>

{#if pets.length === 0}
    <p>No pets available.</p>
{:else}
    <ul>
        {#each pets as pet}
            <li>
                <h3>{pet.name} ({pet.type})</h3>
                <p>Hunger: {pet.hunger} | Happiness: {pet.happiness}</p>
                <p>Status: {pet.adopted ? 'Adopted' : 'Available'}</p>
                {#if !pet.adopted}
                    <button on:click={() => adopt(pet.id)}>🐾 Adopt</button>
                {/if}
            </li>
        {/each}
    </ul>
{/if}

<style>
    ul {
        list-style: none;
        padding: 0;
    }
    li {
        margin-bottom: 1.5rem;
        padding: 1rem;
        border: 1px solid #ccc;
        border-radius: 0.5rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    button {
        margin-top: 0.5rem;
    }
</style>
