<template>
    <Page>
        <ActionBar title="Dialogs" />
        <StackLayout>
        <Button v-for="(dialog, index) in dialogs" :key="index"> {{ dialog }}</Button>
        </StackLayout>
        </Page>
</template>

<script>
export default {
    data() {
        return {
            dialogs: ["Action","Alert","Confirm","Login","Prompt"]
        }
    }
}
</script>

<style>
</style>
