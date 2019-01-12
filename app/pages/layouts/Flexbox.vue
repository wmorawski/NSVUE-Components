<template>
  <Page>
    <ActionBar title="Flexbox Layout"/>
    <FlexboxLayout
      flexDirection="column-reverse"
      justifyContent="space-around"
      backgroundColor="#3c495e"
    >
      <Label text="first" height="70" backgroundColor="#43b883"/>
      <Label text="second" alignSelf="center" width="70" height="70" backgroundColor="#1c6b48"/>
      <Label
        text="third\nflex-end"
        alignSelf="flex-end"
        width="70"
        height="70"
        backgroundColor="#289062"
      />
      <Label text="fourth" height="70" backgroundColor="#289062"/>
    </FlexboxLayout>
  </Page>
</template>
