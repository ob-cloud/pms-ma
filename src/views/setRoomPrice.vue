<template>
  <div id="indexOperating">
    <van-nav-bar
      title="设置房价"
      left-text="返回"
      @click-left="onClickLeft"
      z-index="2"
      fixed
      :placeholder="true"
    />
    <van-cell title="营业日期" :value="date.join('/')" @click="show = true" />
    <div class="center-box">
      <van-cell-group>
        <van-cell title="房型名称">
          <template #extra>
            <span @click="showPicker2 = true">{{roomType.RoomTypeName}}</span>
          </template>
        </van-cell>
        <van-cell title="房价类型">
          <template #extra>
            <span @click="showPicker = true">{{roomRate.RoomRateTypeName}}</span>
          </template>
        </van-cell>
      </van-cell-group>
      <van-field v-model="price" label="房价" placeholder="请输入房价" input-align="right" />
    </div>
    <van-button type="info" class="confim-btn" :disabled="!price" @click="changePrice">确定</van-button>
    <!-- 选择营业日期 -->
    <van-calendar
      v-model="show"
      type="range"
      :show-confirm="false"
      @confirm="selectDate"
      :max-date="maxDate"
    />
    <!-- 房型 -->
    <van-popup v-model="showPicker2" round position="bottom">
      <van-picker
        show-toolbar
        :columns="roomTypeList"
        value-key="RoomTypeName"
        @cancel="showPicker2 = false"
        @confirm="onConfirm2"
      />
    </van-popup>
    <!-- 房价 -->
    <van-popup v-model="showPicker" round position="bottom">
      <van-picker
        show-toolbar
        :columns="roomRateList"
        :value-key="'RoomRateTypeName'"
        @cancel="showPicker = false"
        @confirm="onConfirm"
      />
    </van-popup>
  </div>
</template>
<script>
import {
  NavBar,
  CellGroup,
  Cell,
  Calendar,
  Picker,
  Popup,
  Field,
  Toast,
  Button
} from "vant";
import dayjs from "dayjs";
import SystemAPI from "@/api/system";
import { getChainID } from "@/common/common";
export default {
  data() {
    return {
      show: false,
      date: [],
      maxDate: null,
      roomRate: {},
      roomType: {},
      roomRateList: [],
      roomTypeList: [],
      showPicker: false,
      showPicker2: false,
      price: 0,
      RoomRateID: 0
    };
  },
  components: {
    [NavBar.name]: NavBar,
    [CellGroup.name]: CellGroup,
    [Cell.name]: Cell,
    [Calendar.name]: Calendar,
    [Popup.name]: Popup,
    [Field.name]: Field,
    [Button.name]: Button,
    [Toast.name]: Toast,
    [Picker.name]: Picker
  },
  created() {
    this.date = [dayjs().format("YYYY-MM-DD"), dayjs().format("YYYY-MM-DD")];
    this.maxDate = dayjs().add(5, "year").$d;
    this.getRoomRateList();
    this.getRoomTypeList();
  },
  methods: {
    onClickLeft() {
      this.$router.back(-1);
    },
    formatDate(date) {
      return `${date.getMonth() + 1}/${date.getDate()}`;
    },
    selectDate(date) {
      const [start, end] = date;
      this.show = false;
      this.date = [
        dayjs(start).format("YYYY-MM-DD"),
        dayjs(end).format("YYYY-MM-DD")
      ];
      this.GetRoomRateListByConditionHandler();
    },
    getRoomRateList() {
      SystemAPI.GetRoomRateTypeListHandler(getChainID())
        .then(res => {
          if (res.status === 200 && res.data && res.data.length) {
            console.log("res", res);
            this.roomRateList = res.data;
            this.roomRate = res.data[0];
          }
        })
        .catch(err => {
          console.log("getRoomRateListErr", err);
        });
    },
    getRoomTypeList() {
      SystemAPI.GetRoomTypeHandler(getChainID())
        .then(res => {
          if (res.status === 200 && res.data && res.data.length) {
            console.log("res", res);
            this.roomTypeList = res.data;
            this.roomType = res.data[0];
          }
        })
        .catch(err => {
          console.log("getRoomTypeListErr", err);
        });
    },
    onConfirm(value) {
      this.roomRate = value;
      this.showPicker = false;
      this.GetRoomRateListByConditionHandler();
    },
    onConfirm2(value) {
      this.roomType = value;
      this.showPicker2 = false;
      this.GetRoomRateListByConditionHandler();
    },
    changePrice() {
      SystemAPI.RoomRateBatchSetHandler(
        getChainID(),
        this.date[0],
        this.date[1],
        this.roomType.RoomTypeID,
        this.roomRate.RoomRateTypeID,
        this.price,
        this.RoomRateID
      )
        .then(res => {
          console.log("ressss", res)
          if (res.status === 200 && res.data) {
            Toast.success('设置成功');
          } else {
            Toast.fail('设置失败');
          }
        })
        .catch(err => {
            Toast.fail('设置失败');
          console.log("getRoomTypeListErr", err);
        });
    },
    GetRoomRateListByConditionHandler() {
      SystemAPI.GetRoomRateListByConditionHandler(
        getChainID(),
        this.date[1],
        this.roomType.RoomTypeID,
        this.roomRate.RoomRateTypeID
      )
        .then(res => {
          console.log("ressss", res)
          if (res.status === 200 && res.data && res.data.AccDate) {
            this.price = res.data.DRoomRate;
            this.RoomRateID = res.data.RoomRateID;
          } else {
            this.price = 0;
            this.RoomRateID = 0;
          }
        })
        .catch(err => {
          console.log("getRoomTypeListErr", err);
        });
    }
  }
};
</script>

<style scoped lang="less">
#indexOperating {
  text-align: left;
  background-color: #f8f8f8;
  .center-box {
    margin: 10px;
    padding-bottom: 20px;
  }
  .confim-btn {
    position: fixed;
    bottom: 0;
    width: 100%;
  }
}
</style>
