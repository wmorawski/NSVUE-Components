<template>
  <Page>
    <ActionBar title="Dock Layout"/>
    <DockLayout stretchLastChild="false">
      <Label class="blue" text="top" dock="top"/>
      <Label class="red" text="left" dock="left"/>
      <Label class="orange" text="bottom" dock="bottom"/>    
      <Label class="green" text="right" dock="right"/>
      <label text="center text" backgroundColor="black"/>
      <Image src="~/images/chart.png" />
      </DockLayout>
  </Page>
</template>

<style scoped>
label {
    color:white;
}
.red {
  background: rgb(214, 61, 61);
}
.blue {
  background: rgb(51, 146, 224);
}
.green {
  background: rgb(33, 180, 99);
}
.orange {
  background: rgb(218, 142, 28);
}
image {
    width:10%;
    background: brown;
}
</style>

