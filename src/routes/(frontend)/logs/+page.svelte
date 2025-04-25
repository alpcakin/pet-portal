<script lang="ts">
    import { onMount } from 'svelte';

    let logs: string[] = [];
    let error = '';

    async function loadLogs() {
        try {
            const res = await fetch('/api/log');
            logs = await res.json();
        } catch {
            error = 'Failed to load logs.';
        }
    }

    onMount(loadLogs);
</script>

<h2>Action History</h2>

{#if error}
    <p>{error}</p>
{:else if logs.length === 0}
    <p>No logs found.</p>
{:else}
    {#each logs as log}
        <p>{log}</p>
    {/each}
{/if}
