<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
export default {};
</script>
<style lang="less">
#app {
  min-height: 100vh;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  font-size: 14Px;
  background-color: #f8f8f8;
  .van-nav-bar {
    background-color: #f8f8f8;
    .van-nav-bar__title {
      font-weight: bold;
    }
  }
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
