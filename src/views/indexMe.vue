<template>
  <div id="indexMe">
    <van-nav-bar title="我的" z-index="2" fixed :border="false" :placeholder="true" >
      <template #right>
        <h2 class="loginOut" @click="loginOut">退出</h2>
      </template>
    </van-nav-bar>
    <div class="me-center">
      <div class="me-box">
        <span class="user-name">
          <van-icon name="friends-o" />
          {{baseInfo.UserName}}
        </span>
      </div>
      <div class="hotel-info">
        <van-cell icon="wap-home-o" title="酒店名称" :value="hotelInfo.ChainName" />
        <van-cell icon="phone-o" title="联系电话" :value="hotelInfo.Telephone" />
        <van-cell icon="logistics" title="传真" :value="hotelInfo.Fax" />
        <van-cell icon="coupon-o" title="地址" :value="hotelInfo.ChainAddress" />
      </div>
      <div class="setting-box">
        <van-cell icon="setting-o" v-if="hasPower(503)" title="房价设置" is-link to="/setroomprice" />
      </div>
    </div>
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
<style lang="less">
#indexMe {
  .van-nav-bar__title {
    text-align: left;
    margin-left: 20px;
    font-weight: bold;
  }
}
</style>
<style scoped lang="less">
#indexMe {
  .me-center {
    height: calc(100vh - 2.6rem);
    background-color: #fff;
  }
  .login-out {
    margin: 20px 0;
    width: 80%;
  }
  .me-box {
    background-color: #f8f8f8;
    border-radius: 0 0 60px 60px;
    min-height: 150px;
    position: relative;
    display: flex;
    .user-name {
      padding: 40px 0 0 40px;
      font-size: 22px;
    }
  }
  .me-box::after {
    position: absolute;
    content: "";
    left: 0;
    right: 0;
    height: 2px;
    bottom: 0;
    // background: repeating-linear-gradient(-45deg, #ff6c6c 0, #ff6c6c 4%, transparent 0, transparent 5%, #1989fa 0, #1989fa 9%, transparent 0, transparent 10%);
  }
  // .hotel-info-box {
  //   position: relative;
  // }
  .setting-box,.hotel-info {
    position: relative;
    top: -50px;
    text-align: left;
    margin: 10px 10%;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 0 0 1px #ebebeb;
    .van-cell {
      align-items: center;
    }
    .van-cell__value,.van-cell__title {
      line-height: 40px;
    }
  }
  .hotel-info {
    width: 80%;
  }
  .hotel-remark {
    font-size: 12px;
    text-indent: 2em;
    padding: 0 18px;
    color: #969799;
  }
  .loginOut {
    color: @baseColor;
    font-size: 16px;
  }
}
</style>
