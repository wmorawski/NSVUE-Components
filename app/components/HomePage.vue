<template>
<Page>
    <StackLayout>
        <label v-for="(layout, index) in layouts" :text="layout + ' Layout'" :key="index" @tap="navigateTo(index)"/>
    </StackLayout>
</Page>
</template>

<script>
import Vue from 'nativescript-vue'
import Absolute from './Absolute'

export default {
    data() {
        return {
            layouts: ['Absolute','Dock','Flexbox','Grid','Wrap']
        }
    },
    methods: {
        navigateTo(index) {
            this.$navigateTo(Absolute)
        }
    }
}
</script>

<style>
ActionBar {
  background-color: #53ba82;
  color: #ffffff;
}
label {
    background-color:#436469;
    color:white;
    font-size:15;
    height:20%;
    width:100%;
    padding: 20;
    vertical-align: center;
    text-align: center;
}
</style>