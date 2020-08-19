<template>
  <div id="addtrans">
    <van-nav-bar title="入账" left-text="返回" fixed placeholder left-arrow @click-left="onClickLeft" />
    <div class="three-btn-box">
      <van-button :type="activeItemID === item.ItemID ? 'info':'default'" v-for="item in accList" :key="item.ItemID" @click="accChange(item)">{{item.SubItemName}}</van-button>
    </div>
    <van-cell-group class="sub-from">
      <van-cell :title="'科目：' + (selcetItem.SubItemName || '')" :value="'编号：' + (selcetItem.ItemID || '')" />
      <van-field v-model="inputMoney" label="金额：" type="number" placeholder="请输入金额" input-align="right" :disabled="disabledBtn" />
      <van-field v-model="inputNum" label="数量：" type="digit" placeholder="数量" input-align="right" :disabled="disabledBtn" />
      <van-cell title="总金额：" :value="'￥：' + (inputNum * inputMoney)" />
    </van-cell-group>
    <van-button type="info" block @click="addccitem">确定</van-button>
  </div>
</template>
<script>
import { NavBar, Tab, Tabs, Cell, CellGroup, Calendar, Field, Popup, Picker, Button, Toast, Col, Row } from "vant";
import dayjs from 'dayjs';
import SystemAPI from "@/api/system";
import { getChainID, getFoliostate } from "@/common/common";
export default {
  data() {
    return {
      accList: [], //按钮列表
      activeItemID: 0,
      selcetItem: {},
      inputNum: 1,
      inputMoney: 0,
      disabledBtn: false
    };
  },
  components: {
    [NavBar.name]: NavBar,
    [Tab.name]: Tab,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Calendar.name]: Calendar,
    [Field.name]: Field,
    [Popup.name]: Popup,
    [Picker.name]: Picker,
    [Button.name]: Button, 
    [Toast.name]: Toast, 
    [Col.name]: Col, 
    [Row.name]: Row, 
    [Tabs.name]: Tabs
  },
  methods: {
    onClickLeft() {
      this.$router.back(-1);
    },
    GetAccItemHandler() {
      SystemAPI.GetAccItemHandler(getChainID(), this.$route.query.itemtype).then(res => {
        if(res && res.data && res.data.length) {
          this.accList = res.data.filter(ele => {
            return [2080,6000,6010,1005,2011,1007,1000,6005,1083].indexOf(ele.ItemID) === -1;
          });
        }
      }).catch(err => {

      })
    },
    accChange(item) {
      this.selcetItem = item;
      this.inputNum = 1;
      this.activeItemID = item.ItemID;
      
          //data-item获取ItemID,data-price > Price,data-subitem > SubItemID,data-direction > Direction
      if (this.$route.query.money) {
      } else {
        this.inputMoney = item.Price;
      }
    },
    addccitem() {
        var folioid = this.$route.query.folioid;
        var roomno = this.$route.query.roomno;
        var itemid = this.activeItemID
        var subitemid = this.selcetItem.SubItemID;
        var num = this.inputNum;
        var direction = this.selcetItem.Direction;
        var debit = 0, credit = 0, total = 0;

        total = this.inputNum * this.inputMoney;
        if (total == 0) { Toast.fail("入账金额不能为0！"); return false; }
        if (this.$route.query.itemtype == "1") {
            credit = total;
        } else {
            debit = total;
        }
        if (itemid <= 0) { Toast.fail("请选择科目！"); return false; }
        if (num <= 0) { Toast.fail("数量不能小于0！"); return false; }
        const queryUrl = "?chain_id=" + getChainID() + "&folioid=" + folioid + "&roomno=" + roomno
            + "&price=" + this.inputMoney + "&itemid=" + itemid + "&subitemid=" + subitemid + "&debit=" + debit + "&credit=" + credit + "&count=" + num;
        SystemAPI.AddTransHandler(queryUrl).then(res => {
          console.log('AddTransHandlerREs', res);
          this.AddTransHandler(res.data);
        }).catch(err => {
          console.log('AddTransHandlerErr', err)
        })
    },
    AddTransHandler(result) {
      var folioid = this.$route.query.folioid;
      if (parseInt(result) > 0) {
          if (this.$route.query.money) {
              Toast.loading({
                message: '退房中...',
                forbidClick: true,
                duration: 0
              });
              SystemAPI.CheckOutRoomFolioHandler(getChainID(), folioid).then(res => {
                if (res.data != "") {
                    Toast.fail("结账退房失败！");
                }
                else {
                    Toast.success("结账退房成功");
                    this.$router.push({
                      path: '/bookroomfolio',
                      query: {
                        action: 'checkout',
                        roomno: this.$route.query.roomno,
                        roomtypeid: this.$route.query.roomtypeid,
                        roomfolioid: this.$route.query.folioid,
                      }
                    })
                }
              }).catch(err => {
                console.log('CheckOutRoomFolioHandlerErr', err)
              })
          } else {
              Toast.success("入账成功！");

          }
        
      } else {
          Toast.fail("入账失败！");
      }
    }
    
  },
  created() {
    this.GetAccItemHandler();
    if (this.$route.query.money) {
        this.inputMoney = this.$route.query.money;
        this.disabledBtn = true;
    }
  },
  beforeDestroy() {
    Toast.clear()
  }
};
</script>

<style scoped lang="less">
#addtrans {
  .three-btn-box {
    border: 1px solid #ebebeb;
    display: flex;
    flex-wrap: wrap;
    .van-button {
      width: 30%;
      margin: 10px 2.5%;
      font-size: 12px;
      padding: 0 0;
    }
    .van-button:nth-child(3n + 2) {
      margin: 10px 0;
    }
  }
  .sub-from {
    margin-top: 40px;
    text-align: left;
    .van-cell__value {
      text-align: left;
    }
  }
}
</style>
