<template>
  <div id="indexHome">
    <!-- <van-nav-bar title="千顺酒店" fixed :border="false" :placeholder="true" class="white-color">
      <template #right>
        <van-icon name="replay" @mousedown="reflash" size="18"/>
      </template>
    </van-nav-bar> -->
    <img src="https://www.on-bright-gz.com/images/upload/202007/1595572520143027.png" width="100%" alt="">
    <van-cell >
      <template #title>
        <div class="room-rate">
          <p class="custom-title">房态 </p>
        </div>
      </template>
    </van-cell>
    <van-grid :column-num="3" :border="false">
      <van-grid-item v-for="(item,key) in totleInfo" :key="key" class="totle-info">
        {{item.name}}:
        {{item.value}}
      </van-grid-item>
    </van-grid>
    <van-cell >
      <template #title>
        <div class="room-rate">
          <van-icon name="home-o" class="search-icon" />
          <p class="custom-title">房型 （可售/全部）</p>
          <!-- <van-tag type="primary"></van-tag> -->
        </div>
      </template>
    </van-cell>
    <van-grid :column-num="2" :border="false">
      <van-grid-item v-for="(item,key) in roomtypeList" :key="key" class="totle-info">
        {{item.RoomTypeName}}:（{{item.RoomCount - item.CheckInCount - item.BookInCount -item.StopSaleCount}} / {{item.RoomCount}}）
        <!-- objRoom.RoomTypeName,
                parseInt(objRoom.RoomCount) -
                parseInt(objRoom.CheckInCount) - parseInt(objRoom.BookInCount) -
                parseInt(objRoom.StopSaleCount) , objRoom.RoomCount) -->
      </van-grid-item>
    </van-grid>
  </div>
</template>
<script>
import { Button, Grid, GridItem, Cell, Tag, Icon, NavBar } from "vant";
import SystemAPI from "@/api/system";
import { getChainID } from "@/common/common";
import dayjs from "dayjs"
export default {
  data() {
    return {
      totleInfo: {
        EmptySum: {
          name: "剩余房数",
          value: 0
        },
        BookInSum: {
          name: "预定房",
          value: 0
        },
        OTACountSum: {
          name: "预售房",
          value: 0
        },
        CheckInSum: {
          name: "在住房",
          value: 0
        },
        PreDeptSum: {
          name: "预离房",
          value: 0
        },
        StopSaleSum: {
          name: "停售房",
          value: 0
        },
        RoomSum: {
          name: "总房数",
          value: 0
        },
        Occupancy: {
          name: "出租率",
          value: 0
        },
        RoomRatePre: {
          name: "预测平均房价",
          value: 0
        }
      },
      roomtypeList: []
    };
  },
  components: {
    [Grid.name]: Grid,
    [GridItem.name]: GridItem,
    [Cell.name]: Cell,
    [Tag.name]: Tag,
    [Icon.name]: Icon,
    [NavBar.name]: NavBar,
    [Button.name]: Button
  },
  created() {
    this.reflash();
  },
  methods: {
    getTotleInfo() {
      SystemAPI.RoomStatusCountHandelLogic(getChainID()).then(res => {
        if(res.status === 200 && res.data) {
          for (const key in res.data) {
            if (this.totleInfo[key]) {
              this.totleInfo[key].value = res.data[key];
            }
          }
        }
      }).catch( err => {
        console.log('RoomStatusCountHandelLogicErr', err)
      })
    },
    getChainDetails() { //chainId, accDate, action
      SystemAPI.ChainDetailsHandelLogic(getChainID(),dayjs().format('YYYY-MM-DD') , 'room_type').then(res => {
        if(res.status === 200 && res.data) {
          this.roomtypeList = res.data
        }
      }).catch( err => {
        console.log('RoomStatusCountHandelLogicErr', err)
      })
    },
    reflash() {
      this.getTotleInfo();
      this.getChainDetails();
    }
  }
};
</script>

<style lang="less">
#indexHome {
  .totle-info {
    font-size: 14px;
    line-height: 24px;
  }
  .custom-title {
    margin-right: 4px;
    vertical-align: middle;
  }
  .search-icon {
    line-height: inherit;
  }
  .room-rate {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    height: 24px;
  }
  .van-grid-item__content {
    padding-left: 0;
    padding-right: 0;
    font-size: 12px;
  }
  .white-color {
    font-size:17px;
    color:rgba(3,3,3,1);
    .van-nav-bar__title {
      color:rgba(3,3,3,1);
    }
  }
}
</style>
