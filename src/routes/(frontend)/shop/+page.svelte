<script lang="ts">
    import { currentUser } from '$lib/stores';
    import { goto } from '$app/navigation';

    let message = '';
    let error = '';

    $: user = $currentUser;

    async function buy(item: 'food' | 'toy' | 'treat') {
        if (!user?.id) {
            goto('/login');
            return;
        }

        const prices = { food: 5, toy: 10, treat: 15 };
        const cost = prices[item];

        const res = await fetch('/api/shop', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id, item, cost })
        });

        const data = await res.json();

        if (res.ok) {
            message = data.message;
            error = '';
            const userRes = await fetch('/api/auth/user?id=' + user.id);
            const updatedUser = await userRes.json();
            localStorage.setItem('user', JSON.stringify(updatedUser));
            currentUser.set(updatedUser);
        } else {
            message = '';
            error = data.message;
        }
    }
</script>

<h1>Pet Shop</h1>

{#if message}<p style="color: green;">{message}</p>{/if}
{#if error}<p style="color: red;">{error}</p>{/if}

{#if user}
    <p>Budget: ${user.budget}</p>
    <p>Inventory:</p>
    <ul>
        <li>Food: {user.inventory.food}</li>
        <li>Toy: {user.inventory.toy}</li>
        <li>Treat: {user.inventory.treat}</li>
    </ul>
    <p>Buy Items:</p>
    <button on:click={() => buy('food')}>Buy Food ($5)</button>
    <button on:click={() => buy('toy')}>Buy Toy ($10)</button>
    <button on:click={() => buy('treat')}>Buy Treat ($15)</button>
{/if}

<style>
    button {
        padding: 0.5rem;
        font-size: 1rem;
        margin-right: 0.5rem;
        margin-top: 0.5rem;
    }
</style>
