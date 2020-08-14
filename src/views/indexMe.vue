<template>
  <div id="indexMe">
    <!-- <van-nav-bar title="关于我的" z-index="2" fixed :border="false" :placeholder="true" /> -->
    <van-contact-card
      type="edit"
      :name="baseInfo.UserName"
      :tel="baseInfo.Mobile ||'暂无'"
      :editable="false"
    />
    <div class="hotel-info">
      <van-cell title="酒店名称" :value="hotelInfo.ChainName" />
      <van-cell title="联系电话" :value="hotelInfo.Telephone" />
      <van-cell title="传真" :value="hotelInfo.Fax" />
      <van-cell title="地址" :value="hotelInfo.ChainAddress" />
      <p class="hotel-remark">{{hotelInfo.Remark}}</p>
    </div>
    <van-cell icon="setting-o" v-if="hasPower(503)" title="房价设置" is-link to="/setroomprice" />
    <van-button type="info" class="login-out" @click="loginOut" size="small">退出</van-button>
    <!-- hasPower(505) -->
  </div>
</template>
<script>
import { Icon, ContactCard, NavBar, cell, Button } from "vant";
import { getChainID, checkVal } from "@/common/common";
export default {
  data() {
    return {};
  },
  components: {
    [ContactCard.name]: ContactCard,
    [Icon.name]: Icon,
    [NavBar.name]: NavBar,
    [cell.name]: cell,
    [Button.name]: Button,
    baseInfo: {},
    hotelInfo: {}
  },
  created() {
    console.log("LoginResult", JSON.parse(localStorage.getItem("LoginResult")));
    const LoginResult = JSON.parse(localStorage.getItem("LoginResult"));
    this.baseInfo = LoginResult[0];
    this.hotelInfo =
      LoginResult[1].find(ele => ele.ChainID == getChainID()) || {};
  },
  methods: {
    hasPower(code) {
      return checkVal(code);
    },
    loginOut() {
      localStorage.removeItem("LoginResult");
      localStorage.removeItem("Login");
      localStorage.removeItem("user_id");
      localStorage.removeItem("ChainLength");
      localStorage.removeItem("chain_id");
      localStorage.removeItem("chain_name");
      this.$router.push({
        path: '/login'
      })
    }
  }
};
</script>

<style scoped lang="less">
#indexMe {
  .login-out {
    margin: 20px 0;
    width: 80%;
  }
  .hotel-info {
    text-align: left;
    margin: 10px;
    min-height: 200px;
  }
  .hotel-remark {
    font-size: 12px;
    text-indent: 2em;
    padding: 0 18px;
    color: #969799;
  }
}
</style>
