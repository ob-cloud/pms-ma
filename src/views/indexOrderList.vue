<template>
  <div id="indexPriceSet">
    <!-- <van-nav-bar title="房单列表" z-index="2" fixed :border="false" :placeholder="true" /> -->
    <van-cell>
      <template #title>
        <span>营业日期</span>
        <span class="date-select" @click="show = true">{{date}}</span>
      </template>
      <template #extra>
        <span>状态</span>
        <span class="date-select" @click="showPicker = true">{{type}}</span>
      </template>
    </van-cell>
    <ul v-if="orderList.length">
      <li class="order-item" v-for="(item, index) in orderList" :key="index">
        <p class="order-base">
          <span>预订人：{{item.ContractName}}</span>
          <span>编号{{item.FolioID}}</span>
          <span>{{getFoliostate(item.FolioState)}}</span>
        </p>
        <van-row gutter="20">
          <van-col span="12">预定时间：{{item.Arrival.slice(0, 10)}}</van-col>
          <van-col span="12">房型名称：{{item.RoomTypeName}}</van-col>
          <van-col span="12">入住时间：{{item.Arrorig.slice(0, 10)}}</van-col>
          <van-col span="12">退房时间：{{item.Deporig.slice(0, 10)}}</van-col>
        </van-row>
        <div class="to-order">
          <van-button type="default" size="small">查看</van-button>
        </div>
      </li>
    </ul>
    <p class="no-tips" v-else>暂无数据</p>
    <van-popup v-model="showPicker" round position="bottom">
      <van-picker
        show-toolbar
        :columns="columns"
        @cancel="showPicker = false"
        @confirm="selectPick"
      />
    </van-popup>
    <van-calendar
      v-model="show"
      :show-confirm="false"
      @confirm="selectDate"
      :max-date="maxDate"
      :min-date="minDate"
      :default-date="defaultDate"
    />
  </div>
</template>
<script>
import {
  Cell,
  CellGroup,
  Calendar,
  Icon,
  NavBar,
  Picker,
  Popup,
  Col,
  Button,
  Row
} from "vant";
import SystemAPI from "@/api/system";
import { getChainID } from "@/common/common";
import dayjs from "dayjs";
export default {
  data() {
    return {
      date: "",
      type: "全部",
      showPicker: false,
      columns: ["全部", "预订", "取消", "在住", "退房", "未到"],
      show: false,
      minDate: new Date(2010, 0, 1),
      maxDate: new Date(),
      defaultDate: "",
      orderList: []
    };
  },
  components: {
    [NavBar.name]: NavBar,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Calendar.name]: Calendar,
    [Picker.name]: Picker,
    [Popup.name]: Popup,
    [Col.name]: Col,
    [Row.name]: Row,
    [Button.name]: Button,
    [Icon.name]: Icon
  },
  created() {
    this.date = dayjs().format("YYYY-MM-DD");
    this.defaultDate = dayjs().$d;
    this.getOrderList();
  },
  methods: {
    selectPick(value) {
      this.type = value;
      this.showPicker = false;
      this.getOrderList();
    },
    selectDate(date) {
      this.show = false;
      this.date = dayjs(date).format("YYYY-MM-DD");
      this.getOrderList();
    },
    getOrderList() {
      SystemAPI.GetRoomFolioListHanler(
        getChainID(),
        this.date,
        this.columns.indexOf(this.type)
      )
        .then(res => {
          if (res.status === 200 && res.data && res.data.RowCount) {
            console.log("res", res);
            this.orderList = res.data.DataSet;
          } else {
            this.orderList = [];
          }
        })
        .catch(err => {
          console.log("RoomStatusCountHandelLogicErr", err);
          this.orderList = [];
        });
    },
    getFoliostate(state) {
      switch (state) {
        case 1:
          return "预订";
        case 2:
          return "取消";
        case 3:
          return "未到";
        case 4:
          return "入住";
        case 5:
          return "退房";
      }
    }
  }
};
</script>

<style scoped lang="less">
#indexPriceSet {
  .van-cell__title {
    flex: 2;
    display: flex;
    .date-select {
      flex: 4;
    }
  }
  .date-select {
    flex: 1;
  }
  .order-item {
    padding: 10px 0px;
    margin: 10px;
    border: 1px solid rgba(163, 163, 163, 0.459);
    border-radius: 10px;
    .order-base {
      display: flex;
      justify-content: space-around;
      font-size: 14px;
      font-weight: bold;
    }
    .van-col--12 {
      line-height: 30px;
      font-size: 12px;
    }
    .to-order {
      text-align: right;
      margin: 10px 20px 0 0;
    }
  }
  .no-tips {
    line-height: 40px;
    font-size: 14px;
    color: #c9c9c9;
  }
}
</style>
