<template>
  <div id="login">
    <van-form class="login-box">
      <div class="account">
        <van-field
          v-model="username"
          clearable
          label-width="60"
          label="账号"
          left-icon="contact"
          placeholder="请输入账号"
        />
      </div>
      <div class="password">
        <van-field
          v-model="password"
          clearable
          label-width="60"
          label="密码"
          type="password"
          left-icon="closed-eye"
          placeholder="请输入密码"
        />
      </div>
      <van-checkbox v-model="checked">记住密码</van-checkbox>
      <div class="sub-btn">
        <van-button
          :disabled="!(username && password)"
          type="default"
          @click="loginEven"
        >登录</van-button>
      </div>
    </van-form>
    <van-popup v-model="show" position="bottom" :style="{ height: '30%' }" class="select-inn" round>
      <p class="select-inn-title">请选择分店</p>
      <van-row gutter="20" type="flex" justify="center" class="select-inn-list">
        <van-col span="12" v-for="(item,index) in hotelList" :key="index" @touchstart="selectInn(item)">
          <van-button type="info" round>
            {{item.ChainName}}
            <br />
            {{item.Telephone}}
          </van-button>
        </van-col>
      </van-row>
    </van-popup>
  </div>
</template>
<script>
import { Button, Field, Checkbox, Popup, Col, Row, Toast, Form } from "vant";
import SystemAPI from "@/api/system";
export default {
  data() {
    return {
      username: "system",
      password: "111111",
      checked: true,
      show: false,
      hotelList: [],
      islogin: false
    };
  },
  components: {
    [Field.name]: Field,
    [Checkbox.name]: Checkbox,
    [Col.name]: Col,
    [Row.name]: Row,
    [Popup.name]: Popup,
    [Toast.name]: Toast,
    [Form.name]: Form,
    [Button.name]: Button
  },
  methods: {
    loginEven() {
      if(this.islogin) return;
      this.login = true;
      SystemAPI.LoginHandelLogic(this.username, this.password)
        .then(res => {
          console.log("SystemAPI.login", res);
          this.LoginLogicHandel(res.data);
          this.login = true;
        })
        .catch(err => {
          this.login = true;
          console.log("SystemAPIERR", err);
        });
    },
    LoginLogicHandel(result) {
      if (result.indexOf("Failed") != -1) {
        Toast.fail("登录失败，帐号或密码错误！");
        return;
      } else if (result.indexOf("Exception") != -1) {
        Toast.fail("抱歉，登录出现异常！");
        return;
      } else if (result.indexOf("NoRights") != -1) {
        Toast.fail("抱歉，您没有使用权限！");
        return;
      } else if (result.indexOf("NoChain") != -1) {
        Toast.fail("抱歉，您的帐号未分配酒店！");
        return;
      } else {
        window.localStorage.setItem("LoginResult", JSON.stringify(result));
        window.localStorage.setItem("Login", true);
        window.localStorage.setItem("user_id", result[0].UserID);
        window.localStorage.setItem("ChainLength", result[1].length);
        if (result[2] != undefined && result[2].indexOf(2) != -1) {
          window.localStorage.setItem("GroupRights", true);
        } else {
          window.localStorage.setItem("GroupRights", false);
        }
        if (result[1].length == 1) {
          // window.localStorage.setItem("chain_id", result[1][0].ChainID);
          // window.localStorage.setItem("chain_name", result[1][0].ChainName);
          // window.location.href = "index.html";
          this.selectInn(result[1][0])
        } else { // 多个分店
          this.hotelList = result[1];
          this.show = true;
        }
      }
    },
    selectInn(result){
      window.localStorage.setItem("chain_id", result.ChainID);
      window.localStorage.setItem("chain_name", result.ChainName);
      if(this.checked) {
        window.localStorage.setItem("username", this.username);
        window.localStorage.setItem("password", this.password);
      } else {
        localStorage.removeItem('username')
        localStorage.removeItem('password')
      }
      // window.location.href = "index.html";
      Toast.success('登录成功');
      this.$router.push({
        path:"/index/home"
      })
    }
  },
  created(){
    this.username = localStorage.getItem('username') || ''
    this.password = localStorage.getItem('password') || ''
  }
};
</script>

<style lang="less">
#login {
  width: 100vw;
  height: 100vh;
  background: url("https://www.on-bright-gz.com/data/article/1593474821898694364.png")
    rgb(24, 144, 255) no-repeat center center/cover;
  display: flex;
  justify-content: center;
  align-items: center;
  .login-box {
    position: relative;
    width: 68%;
    min-height: 180px;
    padding: 24px 20px 40px;
    background-color: #fff;
    border-radius: 10px;
    .password,
    .account {
      position: relative;
      padding: 10px 0px 20px;
    }
    .account::after {
      position: absolute;
      box-sizing: border-box;
      content: " ";
      pointer-events: none;
      right: 16px;
      bottom: 0;
      left: 16px;
      border-bottom: 1px solid @borderColor;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
    }
    .sub-btn {
      position: absolute;
      bottom: -0.6rem;
      left: 50%;
      transform: translateX(-50%);
      width: 84%;
      height: 54px;
      text-align: center;
      line-height: 54px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      .van-button {
        height: 100%;
        width: 100%;
        background-color: @baseColor;
        border-radius: 10px;
        color: #fff;
        border: none;
      }
    }
    > .van-checkbox {
      justify-content: flex-end;
    }
  }
  .select-inn {
    display: flex;
    flex-direction: column;
    .select-inn-title {
      font-size: 14px;
      color: #646566;
      line-height: 32px;
      border-bottom: 1px solid @borderColor;
      margin: 10px 0;
    }
    .select-inn-list {
      flex-wrap: wrap;
      align-content: space-around;
      flex: 1;
    }
  }
}
</style>
