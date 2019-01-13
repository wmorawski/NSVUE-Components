<template>
  <Page backgroundSpanUnderStatusBar="false" statusBarStyle="dark" @navigatedTo="hideKeyboard">
    <ActionBar title="All components"/>
    <ScrollView>
      <StackLayout>
        <ActivityIndicator busy="true"/>
        <Button text="Button" @tap="updateProgress"/>
        <DatePicker v-model="selectedDate" @dateChange="dateChange()"/>
        <HtmlView html="<div><h1>HtmlView</h1></div>"/>
        <Progress :value="currentProgress"/>
        <ListView for="item in listOfItems" @itemTap="onItemTap">
          <v-template>
            <Label :text="item"/>
          </v-template>
        </ListView>
        <ListPicker
          :items="listOfItems"
          selectedIndex="0"
          v-model="selectedIndex"
          @selectedIndexChange="selectedIndexChanged"
        />
        <SearchBar
          ref="searchBar"
          hint="Search hint"
          :text="searchPhrase"
          @textChange="onTextChanged"
          @submit="onSubmit"
        />
        <SegmentedBar>
          <SegmentedBarItem title="First"/>
          <SegmentedBarItem title="Second"/>
          <SegmentedBarItem title="Third"/>
        </SegmentedBar>

        <SegmentedBar :items="segments" v-model="segmentId"></SegmentedBar>

        <Slider value="80" @valueChange="onValueChanged" />

        <Switch checked="true" @checkedChange="switched"/>

      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script>
import * as Toast from "nativescript-toast";
import { SegmentedBarItem } from "tns-core-modules/ui/segmented-bar";

export default {
  data: () => {
    return {
      searchPhrase: "",
      selectedDate: "0000000",
      selectedIndex: 0,
      listOfItems: [
        "abc",
        "def",
        "ghi",
        "jkl",
        "mno",
        "pqr",
        "stu",
        "vwx",
        "yz"
      ],
      currentProgress: 40,
      segmentId: 0,
      segments: []
    };
  },
  created: function() {
    this.listOfItems.forEach((element, index) => {
      if (index > 4) return;
      let segment = new SegmentedBarItem();
      segment.title = element;
      this.$data.segments.push(segment);
    });
  },
  methods: {
    log(data) {
      console.log(data);
      Toast.makeText(data).show();
    },
    dateChange() {
      Toast.makeText(this.selectedDate.toString()).show();
      console.log(this.selectedDate);
    },
    selectedIndexChanged() {
      console.log(this.selectedIndex);
    },
    onItemTap(event) {
      console.log(event.index);
      console.log(event.item);
    },
    updateProgress() {
      this.currentProgress += 10;
      console.log(this.segments);
    },
    onTextChanged() {
      this.log("text changed");
    },
    onSubmit() {
      this.log("search form submitted");
    },
    onSegmentBarChange() {
      this.log("segment bar view changed");
    },
    hideKeyboard() {
      this.$refs.searchBar.nativeView.dismissSoftInput();
    },
    onValueChanged() {
      this.log('slider value changed!')
    },
    switched() {
      this.log('switch changed!');
    }
  }
};
</script>

<style>
ListView {
  height: 100;
}
</style>


