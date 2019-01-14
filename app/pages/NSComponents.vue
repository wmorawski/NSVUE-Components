<template>
  <Page backgroundSpanUnderStatusBar="false" statusBarStyle="dark" @navigatedTo="hideKeyboard">
    <ActionBar title="All components"/>
    <ScrollView>
      <StackLayout>


        <TabView :selectedIndex="tabIndex" @selectedIndexChange="tabViewChanged">
          <TabViewItem title="Tab 1">
            <Label text="Content for Tab 1"/>
          </TabViewItem>
          <TabViewItem title="Tab 2">
            <Label text="Content for Tab 2"/>
          </TabViewItem>
        </TabView>

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
          hint="Search hint!"
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

        <Slider value="80" @valueChange="onValueChanged"/>

        <Switch checked="true" @checkedChange="switched"/>


        <TextField
          :text="textFieldValue"
          hint="Enter text..."
          @textChange="log('text changed')"
          @returnPress="log('pressed enter key')"
          @focus="log('focused!')"
          @blur="log('lost focus')"
        />

        <TextView editable="false">
          <FormattedString>
            <Span text="You can use text attributes such as "/>
            <Span text="bold, " fontWeight="Bold"/>
            <Span text="italic " fontStyle="Italic"/>
            <Span text="and "/>
            <Span text="underline." textDecoration="Underline"/>
          </FormattedString>
        </TextView>

        <TimePicker hour="3" minute="30" @timeChange="log('time changed')"/>

        <WebView src="https://google.com" @loadStarted="log('load started')" @loadFinished="log('load finished')" />



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
      textFieldValue: "",
      tabIndex: 0,
      searchPhrase: "",
      selectedDate: "0000000",
      selectedIndex: 0,
      listOfItems: [
        "abc!!",
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
      this.log("slider value changed!");
    },
    switched() {
      this.log("switch changed!");
    },
    tabViewChanged() {
      this.log("tab view changed!");
    }
  }
};
</script>

<style>
ListView {
  height: 150;
}
TimePicker {
  height: 200;
}
TabView {
  height: 200;
  background-color: #eeeeff;
}
WebView {
  height:300;
}
</style>


