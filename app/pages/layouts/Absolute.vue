<template>
<Page>
    <ActionBar title="Absolute Layout"/>
    <AbsoluteLayout>
       <Label text="Absolute layout under construction..."/>
        <Image src="~/images/chart.png" stretch="none" />
        <Button text="Absolute Button" />
    </AbsoluteLayout>
</Page>
</template>

<style scoped>
ActionBar {
  background-color: #53ba82;
  color: #ffffff;
}
AbsoluteLayout {
     background-color:#adc2c1;
}
Image {
    top:50;
    left:20;
}
Label {
    color:white;
    top:200;
    left: 40;
    font-weight: bold;
    background: #53ba82;
    padding:10;
}
Button {
    border:none;
    background: #9d4cbd;
    color:white;
    top:90;
    left:150;
}
</style>