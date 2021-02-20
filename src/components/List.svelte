<script>
    import CreateCard from '~/components/CreateCard.svelte'
    import ListTitle from '~/components/ListTitle.svelte'
    import Card from '~/components/Card.svelte'    

    export let list
</script>

<div class="list">
    <div class="list__inner">
        <div class="list__heading">
            <ListTitle />
            <p>
                {list.cards.length} cards
            </p>
        </div>
        <div class="list__cards">
            {#each list.cards as  card (card.id)}
                <Card />    
            {/each}            
        </div>
        <CreateCard />
    </div>
</div>

<style lang="scss">
    .list {
        display: inline-block;
        width: 290px;
        height: 100%;        
        box-sizing: border-box;
        font-size: 16px;
        white-space: normal;
        margin: 0 4px;
        .list__inner {
            display: flex;
            flex-direction: column;
            max-height: 100%;
            padding: 10px 8px;
            box-sizing: border-box;
            background: #ebecf0;
            border-radius: 4px;
            .list__heading{
                margin-bottom: 10px;
                p {
                    color: #5e6c84;
                    padding: 0 8px;
                }
            }
            .list__cards{
                overflow-x: hidden;
                overflow-y: auto;
                margin-bottom: 10px;
            }
        }
    }
</style>