<template>
    <div style="width:100vw; height:50px; background-color:#ededed;">
        <div v-if="open" class="modal p4">
            <p>Hello from the modal!</p>
            <button @click="closeModal()">
                Close
            </button>
        </div>
    </div>

</template>
<script setup lang="ts">
const open = ref(false)

const { userModal, closeModal } = useModal();

watch(
    () => userModal.value.isOpen,
    (state: boolean) => {
        open.value = state;
    }
)

</script>
<style lang="scss">
.modal {
    position: fixed;
    z-index: 999;
    top: 20%;
    left: 50%;
    width: 300px;
    margin-left: -150px;
    background-color: aquamarine;
}
</style>