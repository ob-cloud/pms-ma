<template>
  <div id="index">
    <!-- <van-nav-bar :placeholder="true"  :title="title" fixed :border="false" class="white-color">
    </van-nav-bar> -->
    <router-view @changeTitle="changeTitle" />
    <van-tabbar v-model="active" route :placeholder="true">
      <van-tabbar-item icon="home-o" to="/index/home.html">首页</van-tabbar-item>
      <van-tabbar-item icon="hotel-o" to="/index/roomtype.html" v-if="hasPower(504)">房态</van-tabbar-item>
      <van-tabbar-item icon="chart-trending-o" to="/index/revenue.html" v-if="hasPower(502)">分析</van-tabbar-item>
      <van-tabbar-item icon="setting-o" to="/index/indexOrderList.html" v-if="hasPower(505)">订单</van-tabbar-item>
      <van-tabbar-item icon="user-o" to="/index/me.html">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
import { Button, Tabbar, TabbarItem ,NavBar} from "vant";
import SystemAPI from "@/api/system";
import { checkVal } from "@/common/common"
export default {
  components: {
    [Button.name]: Button,
    [Tabbar.name]: Tabbar,
    [NavBar.name]: NavBar,
    [TabbarItem.name]: TabbarItem
  },
  data() {
    return {
      active: 0,
      title: ""
    };
  },
  methods: {
    hasPower(code) {
      return checkVal(code)
    },
    changeTitle(title) {
      this.title = title;
    }
  },
  created() {
  }
};
</script>

<style scoped lang="less">
#index {
  min-height: 100vh;
}
</style>
