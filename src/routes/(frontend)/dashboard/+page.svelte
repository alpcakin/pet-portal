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

            let freshUser = $currentUser;
            if (!freshUser || !freshUser.pets) {
                const raw = localStorage.getItem('user');
                if (raw) {
                    freshUser = JSON.parse(raw);
                    currentUser.set(freshUser);
                }
            }

            if (freshUser && freshUser.pets) {
                pets = allPets.filter((pet: Pet) => freshUser.pets.includes(pet.id));
            } else {
                pets = [];
            }
        } catch (err) {
            error = 'Failed to load pets.';
        }
    }

    async function handleAction(petId: number, action: 'feed' | 'toy' | 'return' | 'treat') {
        if (!user?.id) {
            goto('/login');
            return;
        }

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


                await fetch('/api/log', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: data.message })
                });

                await updateUser();
                await loadPets();
            } else if (res.status === 302) {
                goto('/shop');
            } else {
                error = data.message;
                success = '';
            }
        } catch (err) {
            error = 'Action failed.';
            success = '';
        }
    }


    async function updateUser() {
        if (!user?.id) return;

        const res = await fetch(`/api/auth/user?id=${user.id}`);
        const updatedUser = await res.json();
        localStorage.setItem('user', JSON.stringify(updatedUser));
        currentUser.set(updatedUser);
    }

    onMount(() => {
        if (!user) {
            goto('/login');
        } else {
            loadPets();
        }
    });
</script>

<h1> Your Adopted Pets</h1>

{#if success}<p style="color: green;">{success}</p>{/if}
{#if error}<p style="color: red;">{error}</p>{/if}

{#if user}
    <h3> Budget: {user.budget}$</h3>
    <h3> Inventory</h3>
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
                <button on:click={() => handleAction(pet.id, 'feed')}>Feed (-$5)</button>
                <button on:click={() => handleAction(pet.id, 'toy')}>Play (-$10)</button>
                <button on:click={() => handleAction(pet.id, 'treat')}>Treat (-$15)</button>
                <button on:click={() => handleAction(pet.id, 'return')}>Return (-$20)</button>
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
