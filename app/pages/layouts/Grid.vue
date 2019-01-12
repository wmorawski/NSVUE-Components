<template>
  <Page>
    <GridLayout columns="auto, auto, *" rows="auto, auto, *" backgroundColor="#3c495e">
      <Label text="0,0" row="0" col="0" backgroundColor="#43b883"/>
      <Label text="0,1 (taking two cols) " row="0" col="1" colSpan="2" class="go-right" backgroundColor="#1c6b48"/>
      <label text="0,2" row="0" col="2" />
      <Label text="1,0" row="1" col="0" rowSpan="2" backgroundColor="#289062"/>
      <Label text="1,1" row="1" col="1" backgroundColor="#43b883"/>
      <Label text="1,2" row="1" col="2" backgroundColor="#289062"/>
      <label text="2,0" row="2" col="0"/>
      <Label text="2,1" row="2" col="1" backgroundColor="#1c6b48"/>
      <Label text="2,2" row="2" col="2" backgroundColor="#43b883"/>
    </GridLayout>
  </Page>
</template>

<style scoped>
Label {
    color:white;
    padding:10;
    font-size:15;
}
.go-right {
    text-align: right;
}
</style>

