<template>
  <Page>
    <ActionBar title="NSVUE Components">
      <ActionItem
        ios.systemIcon="15"
        ios.position="right"
        android.systemIcon="ic_menu_share"
        android.position="actionBar"
      />
      <ActionItem
        ios.systemIcon="16"
        ios.position="right"
        text="delete"
        android.position="popup"
      />
    </ActionBar>

    <GridLayout columns="150,auto" rows="150,auto"  backgroundColor="#22b980">

      <label
        v-for="(mainPage, index) in mainPages"
        :text="mainPage"
        :key="index"
        @tap="navigateTo(mainPage)"
      />

    </GridLayout>
  </Page>
</template>

<script>
import MainPages from "~/pages";

export default {
  data() {
    return {
      mainPages: ["LayoutList", "NSComponents"]
    };
  },
  methods: {
    navigateTo(index) {
      this.$navigateTo(MainPages[index]);
    }
  }
};
</script>

<style scoped>
label {
  padding: 20;
  font-size: 15;
  background-color: #7dc2a7;
  color: white;
}
ActionBar {
  color: #3bb158;
}
</style>

