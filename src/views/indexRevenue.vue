<template>
  <div id="indexRevenue">
    <van-nav-bar title="数据分析" z-index="2" fixed :placeholder="true">
    </van-nav-bar>
    <van-tabs @click="onClick">
      <van-tab title="营收分析" name="1">
        <p>营收趋势分析({{trandDate[1]}}~{{trandDate[0]}})</p>
        <line-chart v-if="datacollection" :chartData="datacollection"></line-chart>
        <van-cell title="营业日期" :value="date" @click="show = true" icon="coupon-o"></van-cell>
        <van-cell-group class="show-info">
          <van-cell title="净房费" :value="revenueInfo.RoomAccIncomeDebit" />
          <van-cell title="小商品" :value="revenueInfo.shops" />
          <van-cell title="餐饮" :value="revenueInfo.FoodDebit" />
          <van-cell title="会员卡" :value="revenueInfo.MembershipCardDebit" />
          <van-cell title="其它" :value="revenueInfo.incomeOther" />
          <van-cell title="小计" :value="revenueInfo.incomeSubtotal" />
        </van-cell-group>
      </van-tab>
      <van-tab title="经营分析" name="2">
        <p>经营趋势分析({{trandDate[1]}}~{{trandDate[0]}})</p>
        <line-chart v-if="datacollection2" :chartData="datacollection2"></line-chart>
        <van-cell title="营业日期" :value="date2" @click="show2 = true" icon="coupon-o"></van-cell>
        <van-cell-group class="show-info">
          <van-cell title="出租夜间" :value="statisticsInfo.RentRoomCount" />
          <van-cell title="过夜房" :value="statisticsInfo.NightRoomCount" />
          <van-cell title="钟点房" :value="statisticsInfo.ClDayRoomCount" />
          <van-cell title="日租房" :value="statisticsInfo.DayRoomCount" />
          <van-cell title="出租率" :value="(statisticsInfo.Occupancy || '') + '%'" />
          <van-cell title="平均房价" :value="statisticsInfo.AverageRate" />
          <van-cell title="RevPAR" :value="statisticsInfo.RevPar" />
          <van-cell title="房间总数" :value="statisticsInfo.RoomCount" />
        </van-cell-group>
      </van-tab>
    </van-tabs>
    <van-calendar
      v-model="show"
      :show-confirm="false"
      @confirm="onConfirm"
      :max-date="maxDate"
      :min-date="minDate"
      :default-date="defaultDate"
    />
    <van-calendar
      v-model="show2"
      :show-confirm="false"
      @confirm="onConfirm2"
      :max-date="maxDate"
      :min-date="minDate"
      :default-date="defaultDate"
    />
  </div>
</template>
<script>
import { Tab, Tabs, Cell, CellGroup, Calendar, Icon, NavBar } from "vant";
import SystemAPI from "@/api/system";
import { getChainID } from "@/common/common";
import dayjs from "dayjs";
import LineChart from "@/components/Chart";
export default {
  data() {
    return {
      date: "",
      show: false,
      date2: "",
      show2: false,
      minDate: new Date(2010, 0, 1),
      maxDate: new Date(),
      revenueInfo: {},
      statisticsInfo: {},
      defaultDate: "",
      datacollection: null,
      datacollection2: null,
      trandDate: []
    };
  },
  components: {
    [NavBar.name]: NavBar,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Calendar.name]: Calendar,
    [Icon.name]: Icon,
    LineChart: LineChart
  },
  created() {
    const day = dayjs().add(-1, "day");
    this.defaultDate = day.$d;
    this.onConfirm(day);
    this.onConfirm2(day);
    this.getRevenueRptHandelLogic();
    this.getStatisticsRptHandelLogic();
    this.trandDate = [day.format("MM-DD"), day.add(-6, "day").format("MM-DD")];
  },
  methods: {
    reflash() {
      this.getRevenueHandelLogic();
      this.getRevenueRptHandelLogic();
      this.getStatisticsHandelLogic();
      this.getStatisticsRptHandelLogic();
    },
    onClick(name, title) {
      
    },
    formatDate(date) {
      return `${date.Years() + 1}/${date.getMonth() + 1}/${date.getDate()}`;
    },
    onConfirm(date) {
      this.show = false;
      this.date = dayjs(date).format("YYYY-MM-DD");
      this.getRevenueHandelLogic();
    },
    onConfirm2(date) {
      this.show2 = false;
      this.date2 = dayjs(date).format("YYYY-MM-DD");
      this.getStatisticsHandelLogic();
    },
    getRevenueHandelLogic() {
      SystemAPI.RevenueHandelLogic(getChainID(), this.date)
        .then(res => {
          if (res.status === 200 && res.data && res.data.CreateAccDate) {
            this.revenueInfo = {
              RoomAccIncomeDebit: res.data.RoomAccIncomeDebit.toFixed(2),
              shops: (
                res.data.CommodityDebit +
                res.data.MainFoyerDebit +
                res.data.RoomBarDebit
              ).toFixed(2),
              FoodDebit: res.data.FoodDebit.toFixed(2),
              MembershipCardDebit: res.data.MembershipCardDebit.toFixed(2),
              incomeOther: (
                parseFloat(res.data.AllDebit) -
                parseFloat(res.data.AccCommissionDebit) -
                parseFloat(res.data.CommodityDebit) -
                parseFloat(res.data.FoodDebit) -
                parseFloat(res.data.IncludingBreakfastDebit) -
                parseFloat(res.data.MainFoyerDebit) -
                parseFloat(res.data.MembershipCardDebit) -
                parseFloat(res.data.RoomAccIncomeDebit) -
                parseFloat(res.data.RoomBarDebit)
              ).toFixed(2),
              incomeSubtotal: (
                parseFloat(res.data.AllDebit) -
                parseFloat(res.data.AccCommissionDebit)
              ).toFixed(2)
            };
          } else {
            this.revenueInfo = {};
          }
        })
        .catch(err => {
          this.revenueInfo = {};
          console.log("RoomStatusCountHandelLogicErr", err);
        });
    },
    getRevenueRptHandelLogic() {
      SystemAPI.RevenueRptHandelLogic(
        getChainID(),
        dayjs().format("YYYY-MM-DD")
      )
        .then(res => {
          if (res.status === 200 && res.data) {
            this.RevenueHandel(res.data);
          } else {
          }
        })
        .catch(err => {});
    },
    RevenueHandel(res) {
      this.datacollection = {
        labels: res["Date"],
        datasets: [
          {
            label: "净房费",
            backgroundColor: "#37A2DA",
            data: res["净房费"],
            fill: false,
            borderColor: "#37A2DA",
          },
          {
            label: "小商品",
            backgroundColor: "#32C5E9",
            data: res["小商品"],
            fill: false,
            borderColor: "#32C5E9",
          },
          {
            label: "餐饮",
            backgroundColor: "#67E0E3",
            data: res["餐饮"],
            fill: false,
            borderColor: "#67E0E3",
          },
          {
            label: "含早",
            backgroundColor: "#9FE6B8",
            data: res["含早"],
            fill: false,
            borderColor: "#9FE6B8",
          },
          {
            label: "会员卡",
            backgroundColor: "#FFDB5C",
            data: res["会员卡"],
            fill: false,
            borderColor: "#FFDB5C",
          }
        ]
      };
    },
    getStatisticsHandelLogic() {
      SystemAPI.StatisticsHandelLogic(getChainID(), this.date2)
        .then(res => {
          if (res.status === 200 && res.data && res.data.CreateAccDate) {
            this.statisticsInfo = Object.assign(res.data, {
              Occupancy: parseFloat(res.data.Occupancy).toFixed(2),
              AverageRate: parseFloat(res.data.AverageRate).toFixed(2),
              RevPar: parseFloat(res.data.RevPar).toFixed(2)
            });
          } else {
            this.statisticsInfo = {};
          }
        })
        .catch(err => {
          this.statisticsInfo = {};
          console.log("getStatisticsHandelLogicErr", err);
        });
    },
    getStatisticsRptHandelLogic() {
      SystemAPI.StatisticsRptHandelLogic(
        getChainID(),
        dayjs().format("YYYY-MM-DD")
      )
        .then(res => {
          if (res.status === 200 && res.data) {
            this.StatisticsRptHandel(res.data);
          } else {
          }
        })
        .catch(err => {});
    },
    StatisticsRptHandel(res) {
      this.datacollection2 = {
        labels: res["Date"],
        datasets: [
          {
            label: "RevPar",
            backgroundColor: "#37A2DA",
            data: res["RevPar"],
            fill: false,
            borderColor: "#37A2DA",
          },
          {
            label: "出租率",
            backgroundColor: "#FFDB5C",
            data: res["出租率"],
            fill: false,
            borderColor: "#FFDB5C",
          }
        ]
      };
    },

  }
};
</script>

<style scoped lang="less">
#indexRevenue {
  background-color: #fff;
  .van-cell__title {
    text-align: left;
  }
  .show-info {
    margin: 0 24px;
  }
}
</style>
