<template>
<Page>
    <ActionBar>
         <NavigationButton text="Home" android.systemIcon="ic_menu_back"/>
    </ActionBar>
    <StackLayout orientation="vertical">
        <label v-for="(layout, index) in layouts" :text="layout + ' Layout'" :key="index" @tap="navigateTo(layout)"/>
    </StackLayout>
</Page>
</template>

<script>

import Vue from 'nativescript-vue'
import Layouts from '~/pages/layouts'

export default {
    data() {
        return {
            layouts: ['Absolute','Dock','Flexbox','Grid','Wrap']
        }
    },
    methods: {
        navigateTo(index) {
            this.$navigateTo(Layouts[index]);
        }
    }
}
</script>

<style scoped>

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