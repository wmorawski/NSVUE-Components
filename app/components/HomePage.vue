<template>
    <Page>
        <ActionBar title="NSVUE Components Showcase" />
        <GridLayout rows="auto,*" columns="auto,*" backgroundColor="#22b960">
            <label v-for="(mainPage, index) in mainPages" :text="mainPage" :key="index" @tap="navigateTo(mainPage)" />
        </GridLayout>
    </Page>
</template>

<script>
import MainPages from '~/pages';

export default {
    data() {
        return {
            mainPages: ['LayoutList']
        }
    },
    methods: {
        navigateTo(index) {
            console.log(MainPages[index])
            this.$navigateTo(MainPages[index]);
        }
    }
}
</script>

<style scoped>
    label {
        padding:20;
        font-size:25;
        background-color: #22b980;
        color:white;
    }
</style>

