<template>
  <div id="bookroomfolio">
    <van-nav-bar title="房单" left-text="返回" fixed placeholder left-arrow @click-left="onClickLeft" />
    <van-tabs v-model="active" color="#1989fa" type="card">
      <van-tab title="房单详细">
        <van-cell-group class="left-text">
          <van-cell title="订单状态"  v-if="['booktowalkin', 'checkin', 'checkout', 'cancel'].indexOf(querInfo.action) > -1" :value="FolioState" />
          <van-cell title="房型名称" :value="querInfo.roomtypename" />
          <van-cell title="房间号"  :value="querInfo.roomno" />
          <van-cell title="入住日期" :value="startDate" @click="show = true" />
          <van-cell title="离店日期" :value="endDate" @click="show2 = true" />
          <van-field v-model="booker" label="预定人" input-align="right" placeholder="请输入预定人名称" />
          <van-field v-model="phone" label="联系电话" input-align="right" placeholder="请输入联系电话" />
          <van-field readonly clickable label="订单来源" :value="orderSource.CodeName" input-align="right" placeholder="请选择订单来源" @click="showPicker = true" />
          <van-field readonly clickable label="二级来源" :value="secendSource.CodeName" input-align="right" placeholder="请选择二级来源" @click="showPicker2 = true" />
          <van-field readonly clickable label="房价类型" :value="Roomtype.RoomRateTypeName" input-align="right" placeholder="请选择房价类型" @click="showPicker3 = true" />
          <van-cell title="单晚房价" :value="'￥ '+roomprice" />
          <van-cell title="房间费用" value="内容"  v-if="querInfo.action === 'Detail'"/>
        </van-cell-group>
        <van-button type="info" size="small" :disabled="!(booker && phone)" @click="submitwalkin" block class="checkin-btn" v-if="['walkin', 'booktowalkin'].indexOf(querInfo.action) > -1 ">入住</van-button>
        <van-button type="info" size="small" :disabled="!(booker && phone)" @click="submitbook" block class="checkin-btn" v-if="querInfo.action ==='book'">预定</van-button>
        <van-button type="info" size="small" @click="continueLive" block class="checkin-btn" v-if="querInfo.action ==='checkin'">续住</van-button>
        <van-button type="info" size="small" @click="cancle" block class="checkin-btn" v-if="querInfo.action ==='booktowalkin'">取消</van-button>
      </van-tab>
      <van-tab title="账务">
        <van-row class="mb50">
          <van-col span="24" class="three-box">
            <span>编号</span>
            <span>科目</span>
            <span>消费</span>
            <span>结算</span>
          </van-col>
          <van-col span="24" class="three-box" :class="selectAccount === item.TransID ? 'select-index':''" v-for="item in accountList" :key="item.TransID" @click="selectIndex(item)">
            <span>{{item.ItemID}}</span>
            <span>{{item.ItemName}}</span>
            <span class="color-red">{{item.Debit}}</span>
            <span class="color-red">{{item.Credit}}</span>
          </van-col>
        </van-row>
        <div class="fixed-bottom">
          <van-button type="info" :disabled="!querInfo.roomfolioid" @click="jsacc">结算</van-button>
          <van-button type="info" :disabled="!querInfo.roomfolioid" @click="xfacc">消费</van-button>
          <van-button type="info" :disabled="!selectAccount" @click="deducTrans">冲减</van-button>
          <van-button type="info" :disabled="!querInfo.roomfolioid" @click="endacctrans" v-if="querInfo.action !== 'checkout'">结账</van-button>
        </div>
      </van-tab>
      <van-tab title="房价计划">
        <van-row>
          <van-col span="24" class="three-box">
            <span>编号</span>
            <span>营业日期</span>
            <span>房价</span>
          </van-col>
          <van-col span="24" class="three-box" v-for="item in priceList" :key="item.TransID">
            <span>{{item.RoomRatePlanID}}</span>
            <span>{{item.indate}}</span>
            <span class="color-red">{{item.RoomRate}}</span>
          </van-col>
          <van-col span="24" class="three-box">
            <span>合计</span>
            <span class="color-red">{{totlePrice}}</span>
          </van-col>
        </van-row>
      </van-tab>
    </van-tabs>
    <!-- 入店日期 -->
    <van-calendar v-model="show" @confirm="startDateConfirm" :show-confirm="false"/>
    <van-calendar v-model="show2" @confirm="endDateConfirm2" :show-confirm="false"/>
    <van-calendar v-model="show3" @confirm="continueDate" title="请选择续住日期" :default-date="selectDate" :min-date="continutDate"/>
    <van-popup v-model="showPicker" round position="bottom">
      <van-picker
        show-toolbar
        :columns="columns"
        @cancel="showPicker = false"
        @confirm="onConfirm"
        value-key="CodeName"
      />
    </van-popup>
    <van-popup v-model="showPicker2" round position="bottom">
      <van-picker
        show-toolbar
        :columns="columns2"
        @cancel="showPicker2 = false"
        @confirm="onConfirm2"
        value-key="CodeName"
      />
    </van-popup>
    <van-popup v-model="showPicker3" round position="bottom">
      <van-picker
        show-toolbar
        :columns="columns3"
        @cancel="showPicker3 = false"
        @confirm="onConfirm3"
        value-key="RoomRateTypeName"
      />
    </van-popup>
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
      active: 0,
      querInfo: {},
      startDate: '',//选择开始结束时间
      show: false,
      show2: false,
      endDate: '',
      booker: '',
      phone: '',
      orderSource: {},//选择订单来源
      secendSource: {},
      Roomtype: {}, //房价类型
      showPicker: false,
      showPicker2: false,
      showPicker3: false,
      columns: [],
      columns2: [],
      columns3: [],
      roomprice: '',
      show3: false,
      continutDate: new Date(), //续住的开始时间
      selectDate: new Date(),
      roomFolio: {},
      FolioState: '',
      priceList: [],
      totlePrice: '',
      accountList: [],
      selectAccount: ''
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
    selectIndex(item) {
      this.selectAccount = item.TransID;
    },
    onClickLeft() {
      this.$router.push({
        path: this.querInfo.backPath || '/index/roomtype'
      })
    },
    startDateConfirm(date) {
      this.show = false;
      this.startDate =  dayjs(date).format("YYYY-MM-DD");
    },
    endDateConfirm2(date) {
      this.show2 = false;
      this.endDate =  dayjs(date).format("YYYY-MM-DD");
    },
    GetCodeHandler(codetype, sourceid) {
      SystemAPI.GetCodeHandler(getChainID(), codetype, sourceid).then(res => {
        console.log('GetCodeHandlerres', res);
          if (res.status === 200 && res.data && res.data !== "Failed") { 
            if(sourceid) {
              this.columns2 = res.data;
              this.secendSource = res.data[0];
            } else {
              this.columns = res.data;
              this.orderSource = res.data[0];
              this.GetCodeHandler('SubSourceID', this.orderSource.CodeNo)
            }
          } else {
            if(sourceid) {
              this.columns2 = [];
              this.secendSource = {};
            } else {
              this.columns = [];
            }
          }
      }).catch(err => {
        if(sourceid) {
          this.columns2 = [];
          this.secendSource = {};
        } else {
          this.columns = [];
        }
        console.log('GetCodeHandlererr', err)
      })
    },
    onConfirm(value) {
      this.orderSource = value;
      this.showPicker = false;
      this.GetCodeHandler('SubSourceID', value.CodeNo)
    },
    onConfirm2(value = {}) {
      this.secendSource = value;
      this.showPicker2 = false;
    },
    onConfirm3(value = {}) {
      this.Roomtype = value;
      this.showPicker3 = false;
      this.GetRoomRateListByConditionHandler();
    },
    GetRoomRateTypeListHandler() {
      SystemAPI.GetRoomRateTypeListHandler(getChainID()).then(res => {
        console.log('GetRoomRateTypeListHandlerres', res);
          if (res.status === 200 && res.data && res.data.length) {
              this.columns3 = res.data;
              this.onConfirm3(res.data[0]);
          }
      }).catch(err => {
        console.log('GetRoomRateTypeListHandlererr', err);
      })
    },
    GetRoomRateListByConditionHandler() {
      SystemAPI.GetRoomRateListByConditionHandler(getChainID(), this.startDate, this.$route.query.roomtypeid, this.Roomtype.RoomRateTypeID).then(res => {
        console.log('GetRoomRateListByConditionHandlerres', res);
          if (res.status === 200 && res.data && res.data.AccDate) {
              this.roomprice =  res.data.DRoomRate;
              this.querInfo.roomtypename =  res.data.RoomTypeName;
          }
      }).catch(err => {
        console.log('GetRoomRateListByConditionHandlererr', err);
      })
    },
    submitwalkin() {
      const urlquery = "?chain_id=" + getChainID()
          + "&begindate=" + this.startDate
          + "&enddate=" + this.endDate
          + "&name=" + this.booker
          + "&mobile=" + this.phone
          + "&roomno=" + this.querInfo.roomno
          + "&roomid=" + this.querInfo.roomno
          + "&roomname=" + this.querInfo.roomname
          + "&roomtypeid=" + this.querInfo.roomtypeid
          + "&folioid=" + ""
          + "&roomratetypeid=" + this.Roomtype.RoomRateTypeID
      Toast.loading({
        message: '提交中...',
        forbidClick: true,
        duration: 0
      });
      if (this.$route.query.action == "booktowalkin") {
        SystemAPI.BookToCheckInHandler(urlquery).then(res => {
          console.log('BookToCheckInHandlerres', res.data)
          if (res.status === 200 && res.data && res.data === true) {
            Toast.success('入住成功');
            this.$router.back(-1);
          } else {
            Toast.fail('入住失败');
          }
        }).catch(err => {
          console.log('BookToCheckInHandlerrerr', err);
        })
      } else {
        SystemAPI.WalkInHandler(urlquery).then(res => {
          console.log('WalkInHandlerres', res)
          if (res.status === 200 && res.data && res.data === true) {
            Toast.success('入住成功');
            this.$router.back(-1);
          } else {
            Toast.fail('入住失败');
          }
        }).catch(err => {
          console.log('WalkInHandlererr', err);
        })
      }
    },
    submitbook() {
       const urlquery = "?chain_id=" + getChainID()
        + "&begindate=" + this.startDate
        + "&enddate=" + this.endDate
        + "&name=" + this.booker
        + "&mobile=" + this.phone
        + "&roomno=" + this.querInfo.roomno
        + "&number=" + ''
        + "&sourceid=" + this.orderSource.CodeNo
        + "&subsourcerid=" + this.secendSource.CodeNo
        + "&roomtypeid=" + this.querInfo.roomtypeid
        + "&roomratetypeid=" + this.Roomtype.RoomRateTypeID
        + "&idCard=" + ""
        + "&DepID=" + ""
        + "&SellerDepID=" + ""
        + "&note=" + ""
      Toast.loading({
        message: '预定中...',
        forbidClick: true,
        duration: 0
      });
      SystemAPI.AddPersonBookHandler(urlquery).then(res => {
        console.log('AddPersonBookHandler', res)
        if (res.status === 200 && res.data) {
          Toast.success('预定成功');
          this.$router.back(-1);
        }
      }).catch(err => {
        console.log('AddPersonBookHandlererr', err);
      })
    },
    continueLive() {
      this.show3 = true;
    },
    continueDate(date) {
      SystemAPI.ContinueStayInHandler(getChainID(), this.querInfo.roomfolioid, dayjs(date).format("YYYY-MM-DD")).then(res => {
        console.log('ContinueStayInHandler', res)
        if (res.status === 200) {
          Toast.success('续住成功');
          this.$router.back(-1);
        }
      }).catch(err => {
        console.log('ContinueStayInHandlerErr', err);
      })
    },
    GetRoomFolioHandel() {
      SystemAPI.GetRoomFolioHandel(getChainID(), this.querInfo.roomfolioid, this.querInfo.roomno).then(res => {
        console.log('GetRoomFolioHandelres', res)
        if (res.status === 200 && res.data && res.data.objRoomFolio) {
          this.roomFolio = res.data;
          this.continutDate = dayjs(res.data.objRoomFolio.Depart).add(1, 'day').$d;
          this.startDate =  dayjs(res.data.objRoomFolio.Arrorig).format("YYYY-MM-DD");
          this.endDate =  dayjs(res.data.objRoomFolio.Depart).format("YYYY-MM-DD");
          this.selectDate = this.continutDate;
          this.FolioState = getFoliostate(res.data.objRoomFolio.FolioState)
          this.booker = res.data.objRoomFolio.Name;
          this.phone = res.data.objRoomFolio.Mobile;
          console.log('res.data.objRoomFolio.Depart', dayjs(res.data.objRoomFolio.Depart).$d)
        }
      }).catch(err => {
        console.log('GetRoomFolioHandelerr', err);
      })
    },
    QueryRoomRatePlanHandler() {
      SystemAPI.QueryRoomRatePlanHandler(getChainID(), this.querInfo.roomfolioid).then(res => {
        console.log('QueryRoomRatePlanHandler', res)
        if (res.status === 200 && res.data && res.data.DataSet) {
          this.priceList = res.data.DataSet.map(ele => {
            ele.indate = dayjs(ele.AccDate).format("YYYY-MM-DD")
            return ele;
          })
        }
      }).catch(err => {
        console.log('QueryRoomRatePlanHandler', err);
      })
    },
    GetRoomFolioRateHandler() {
      SystemAPI.GetRoomFolioRateHandler(getChainID(), this.querInfo.roomfolioid, this.querInfo.roomid).then(res => {
        if (res.status === 200 && res.data) {
          this.totlePrice = res.data.toFixed(2)
        }
      }).catch(err => {
        console.log('GetRoomFolioRateHandler', err);
      })
    },
    GetAccTransHandler() {
      SystemAPI.GetAccTransHandler(getChainID(), this.querInfo.roomfolioid).then(res => {
        if (res.status === 200 && res.data && res.data !== 'Failed') {
          this.accountList = res.data;
        }
      }).catch(err => {
        console.log('GetAccTransHandlerErr', err);
      })
    },
    jsacc() {
      this.$router.push({
        path: '/addtrans',
        query: {
          folioid: this.querInfo.roomfolioid,
          roomid: this.querInfo.roomid,
          itemtype: 1,
          roomno: this.querInfo.roomno
        }
      })
    },
    xfacc() {
      this.$router.push({
        path: '/addtrans',
        query: {
          folioid: this.querInfo.roomfolioid,
          roomid: this.querInfo.roomid,
          itemtype: 2,
          roomno: this.querInfo.roomno
        }
      })
    },
    deducTrans() {
      SystemAPI.DeducTransHandler(getChainID(), this.querInfo.roomfolioid, this.selectAccount).then(res => {
        if (res.status === 200 && res.data) {
          Toast.success("冲减成功");
          this.GetAccTransHandler();
          this.selectAccount = "";
        }
      }).catch(err => {
        console.log('DeducTransHandler', err);
      })
    },
    cancle() {
      Toast.loading({
        message: '取消中...',
        forbidClick: true,
        duration: 0
      });
      SystemAPI.CancelPersonBookHandler(getChainID(), this.querInfo.roomfolioid).then(res => {
        if (res.status === 200 && res.data) {
          Toast.success("取消成功");
          this.onClickLeft();
        }
      }).catch(err => {
        console.log('DeducTransHandler', err);
      })
    },
    endacctrans() {
      SystemAPI.CheckOutRoomFolioHandler(getChainID(), this.querInfo.roomfolioid).then(res => {
        if (res.data != "") {
          this.GetAccTransBalanceHandler()
        } else {
           Toast.fail("结账退房成功！");
        }
      }).catch(err => {
          Toast.fail("结账退房失败");
        console.log('DeducTransHandler', err);
      })
    },
    GetAccTransBalanceHandler() {
      SystemAPI.GetAccTransBalanceHandler(getChainID(), this.querInfo.roomfolioid).then(res => {
        if(res && res.data) {
          this.$router.push({
            path: '/addtrans',
            query: {
              folioid: this.querInfo.roomfolioid,
              itemtype: 1,
              roomno: this.querInfo.roomno,
              money: res.data.Balance,
              roomtypeid: this.querInfo.roomtypeid,
            }
          })
        }
      }).catch(err => {
        console.log('DeducTransHandler', err);
      })
    }
  },
  created() {
    this.querInfo = this.$route.query;
    this.startDate = dayjs().format("YYYY-MM-DD");
    this.endDate = dayjs().add(1, 'day').format("YYYY-MM-DD");
    this.GetCodeHandler('SourceID');
    this.GetRoomRateTypeListHandler();
    // getroomtype(); XXX
    // getcuroomrate(); this.GetRoomFolioRateHandler();
    // getroomfolio();  this.GetRoomFolioHandel();
    // getacctrans()  this.GetAccTransHandler();
    // getroomrateplan()  this.QueryRoomRatePlanHandler();
    switch (this.$route.query.action) {
      case "book":
      case "walkin":
          // this.GetRoomFolioRateHandler();
        break;
      case "booktowalkin":
      case "checkin":
      case "checkout":
      case "noshow":
      case "cancel":
          this.GetRoomFolioHandel();
          this.GetAccTransHandler();
          this.QueryRoomRatePlanHandler();
          this.GetRoomFolioRateHandler();
        break;
      default:
        break;
    }
  },
  beforeDestroy() {
    Toast.clear()
  }
};
</script>

<style scoped lang="less">
#bookroomfolio {
  .left-text { 
    text-align: left;
  }
  .checkin-btn {
    margin-left: 5%;
    width: 90%;
    margin-top: 20px;
  }
  .three-box {
    display: flex;
    border-bottom: 1px solid #ebedf0;
    width: 90%;
    margin-left: 5%;
    > span {
      flex: 1;
      font-size: 14px;
      padding: 10px 0;
    }
  }
  .color-red {
    color: red;
  }
  .mb50 {
    margin-bottom: 60px;
  }
  .fixed-bottom {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 60px;
    background-color: #fff;
    display: flex;
    justify-content: space-around;
    align-items: center;
    border-top: 1px solid #ebebeb;
  }
  .select-index {
    background-color: rgba(25, 137, 250, 0.4);
  }
}
</style>
