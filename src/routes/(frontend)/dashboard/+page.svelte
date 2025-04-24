<script lang="ts">
    import { onMount } from 'svelte';
    import { currentUser } from '$lib/stores';
    import type { Pet } from '$lib/types';
    import { goto } from '$app/navigation';

    let pets: Pet[] = [];
    let error = '';
    let success = '';

    $: user = $currentUser;

    async function loadPets() {
        try {
            const res = await fetch('/api/pets');
            const allPets = await res.json();
            pets = allPets.filter((pet: Pet) => user?.pets.includes(pet.id));
        } catch (err) {
            error = 'Failed to load pets.';
        }
    }

    async function handleAction(petId: number, action: 'feed' | 'toy' | 'return') {
        try {
            const res = await fetch('/api/actions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ petId, action, userId: user.id })
            });
            const data = await res.json();

            if (res.ok) {
                success = data.message;
                error = '';
                loadPets();
            } else {
                error = data.message;
                success = '';
            }
        } catch (err) {
            error = 'Action failed.';
            success = '';
        }
    }

    onMount(() => {
        if (!user) {
            goto('/login');
        } else {
            loadPets();
        }
    });
</script>

<h1>📋 Your Adopted Pets</h1>

{#if success}<p style="color: green;">{success}</p>{/if}
{#if error}<p style="color: red;">{error}</p>{/if}

{#if user}
    <h3>💰 Budget: {user.budget}$</h3>

    <h3>🎒 Inventory</h3>
    <ul>
        <li>Food: {user.inventory.food}</li>
        <li>Toy: {user.inventory.toy}</li>
        <li>Treat: {user.inventory.treat}</li>
    </ul>
{/if}

{#if pets.length === 0}
    <p>You haven’t adopted any pets yet.</p>
{:else}
    <ul>
        {#each pets as pet}
            <li>
                <h3>{pet.name} ({pet.type})</h3>
                <p>Hunger: {pet.hunger} | Happiness: {pet.happiness}</p>

                <button on:click={() => handleAction(pet.id, 'feed')}>🍖 Feed (-$5)</button>
                <button on:click={() => handleAction(pet.id, 'toy')}>🧸 Play (-$10)</button>
                <button on:click={() => handleAction(pet.id, 'return')}>↩️ Return (-$20)</button>
            </li>
        {/each}
    </ul>
{/if}

<style>
    ul {
        list-style-type: none;
        padding-left: 0;
    }

    li {
        border: 1px solid #ccc;
        margin-bottom: 1rem;
        padding: 1rem;
        border-radius: 0.5rem;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    button {
        margin-right: 0.5rem;
    }
</style>
