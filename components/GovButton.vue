<script setup>
    const props = defineProps({
        context: Object
    });

    const { label } = props.context;

    const handleClick = () => {
        props.context.node.submit();
    }
</script>

<template>
    <gv-button @click="handleClick">
        {{ label }}
    </gv-button>
</template>