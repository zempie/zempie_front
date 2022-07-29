<template>
    <div class="content" style="width:100vw;">
        sample page - for guest

        <div>
            Counter: {{ counter }}
            <button @click="counter++">
                +
            </button>
            <button @click="counter--">
                -
            </button>

        </div>
    </div>
</template>
<script setup lang="ts">
const title = ref('My App | Guest page')
const description = ref('sample page')


// This will be reactive even you change title/description above
useHead({
    title: title.value,
    meta: [{
        name: 'description',
        content: description.value
    }]
})

const counter = useState('counter', () => Math.round(Math.random() * 1000))




</script>
<style scoped lang="scss">
.content {
    height: calc(100vh - 100px);
}
</style>