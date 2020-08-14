<template>
  <div id="indexRoomType">
    <!-- <van-nav-bar title="房态" :placeholder="true" fixed :border="false">
      <template #right>
        <van-icon name="replay" @mousedown="reflash" size="18" />
      </template>
    </van-nav-bar>-->
    <van-row class="i-tab-box">
      <van-col span="8" class="i-tab" :class="{'active-tab': active === 1}" @click="changeTab(1)">房号</van-col>
      <van-col span="8" class="i-tab" :class="{'active-tab': active === 2}" @click="changeTab(2)">房型</van-col>
      <van-col span="8" class="i-tab" :class="{'active-tab': active === 3}" @click="changeTab(3)">楼层</van-col>
    </van-row>
    <div class="radio-box">
      <van-radio-group v-model="radio" direction="horizontal" icon-size="16px" @change="reLoadData">
        <van-row>
          <van-col
            span="6"
            v-for="(item, index) in radioList"
            :key="index"
            :class="item.type ? 'icon-'+ item.type : '' "
          >
            <van-radio :name="item.type">{{item.name}}</van-radio>
          </van-col>
        </van-row>
      </van-radio-group>
    </div>
    <div class="room-list" ref="wrapper">
      <van-loading type="spinner" color="#1989fa" v-if="isLoading" />
      <van-grid :column-num="3" square border gutter="10px">
        <!--  -->
        <van-grid-item
          v-for="item in dealRoom(roomList)"
          :key="item.RoomNo"
          :class="item.classRoom"
          @click="selectContral(item)"
        >
          <p class="room-num">
            <span>{{item.RoomNo}}</span>
            <span>{{item.RoomTypeCode}}</span>
          </p>
          <p
            class="room-user"
            v-if="item.Guest.length"
          >{{item.Guest.map(ele => ele.Name).join(',')}}</p>
          <ul class="room-font-box">
            <li class="room-font-item" v-for="(item, index) in item.roomText" :key="index">{{item}}</li>
          </ul>
        </van-grid-item>
      </van-grid>
    </div>
    <!-- 房态弹窗 -->
    <van-popup v-model="show" round closeable position="bottom">
      <van-cell
        v-for="item in showList(list)"
        :key="item.code"
        :title="item.text"
        @click="controlBtn(item)"
      />
    </van-popup>
    <!-- 选择清洁员 -->
    <van-overlay :show="showClear" @click="showClear = false">
      <div class="wrapper">
        <div class="block" @click.stop>
          <p>房间号：{{contralItem.RoomNo}}</p>
          <van-field
            readonly
            clickable
            label="清洁员"
            :value="selectClean.UserName"
            placeholder="选择清洁员"
            @click="showPicker = true"
          />
          <van-field
            v-if="showCheck"
            readonly
            clickable
            label="检查员"
            :value="selectCheck.UserName"
            placeholder="选择清检查员"
            @click="showPicker2 = true"
          />
          <van-button type="info" class="clearnroom-btn" @click="toClearRoom">确认</van-button>
        </div>
      </div>
    </van-overlay>
    <!-- 选择清洁员 -->
    <van-popup v-model="showPicker" round position="bottom">
      <van-picker
        show-toolbar
        :columns="CleanUserList"
        value-key="UserName"
        @cancel="showPicker = false"
        @confirm="onConfirm"
      />
    </van-popup>
    <!-- 选择检察员 -->
    <van-popup v-model="showPicker2" round position="bottom">
      <van-picker
        show-toolbar
        :columns="checkUserList"
        value-key="UserName"
        @cancel="showPicker2 = false"
        @confirm="onConfirm2"
      />
    </van-popup>
  </div>
</template>
<script>
import {
  Grid,
  GridItem,
  Col,
  Row,
  Loading,
  NavBar,
  Icon,
  RadioGroup,
  Popup,
  Button,
  Cell,
  Toast,
  Overlay,
  Picker,
  Field,
  Radio
} from "vant";
import IScroll from "iscroll";
import SystemAPI from "../api/system";
import { getChainID } from "@/common/common";
export default {
  data() {
    return {
      active: 1,
      myScroll: null,
      roomList: [],
      isLoading: false,
      timeRoom: "", //钟点房
      radio: "",
      radioList: [
        {
          name: "在住",
          type: "checkin",
          code: "2"
        },
        {
          name: "脏房",
          type: "dirty"
        },
        {
          name: "清洁",
          type: "cleaning"
        },
        {
          name: "停售",
          type: "stop"
        },
        // {
        //   name: "预离",
        //   type: "readygo",
        // }
        {
          name: "全部",
          type: ""
        },
        {
          name: "干净",
          type: "clean"
        },
        {
          name: "预定",
          type: "bookin"
        },
        {
          name: "钟点",
          type: "parttime"
        },
        {
          name: "保密",
          type: "CancelSalf"
        },
        {
          name: "VIP",
          type: "CancelVip"
        },
        {
          name: "检查",
          type: "CancelCheck"
        },
        {
          name: "团队",
          type: "IsTeamRoom"
        }
      ],
      show: false,
      contralItem: {},
      list: [
        { text: "入住", code: "walkin" },
        { text: "预定", code: "book" },
        { text: "查看房单详情", code: "Detail" },
        { text: "设置为干净房", code: "SetClen" },
        { text: "设置为清洁房", code: "SetCleaning" },
        { text: "设置为脏房", code: "SetDiryRoom" },
        { text: "设置为保密房", code: "SetSalf" },
        { text: "取消保密房", code: "CancelSalf" },
        { text: "设置为VIP房", code: "SetVip" },
        { text: "取消VIP房", code: "CancelVip" },
        { text: "设置为检查房", code: "SetCheck" },
        { text: "取消检查房", code: "CancelCheck" }
      ],
      action: "", //查看详情的条件
      disablePower: [], //隐藏的功能按钮
      CleanUserList: [], //清洁员
      checkUserList: [], //检查员
      showClear: false,
      showPicker: false,
      selectClean: {},
      selectCheck: {},
      showPicker2: false,
      showCheck: false
    };
  },
  components: {
    [Grid.name]: Grid,
    [GridItem.name]: GridItem,
    [Col.name]: Col,
    [Loading.name]: Loading,
    [NavBar.name]: NavBar,
    [Icon.name]: Icon,
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio,
    [Popup.name]: Popup,
    [Button.name]: Button,
    [Cell.name]: Cell,
    [Toast.name]: Toast,
    [Overlay.name]: Overlay,
    [Picker.name]: Picker,
    [Field.name]: Field,
    [Row.name]: Row
  },
  methods: {
    changeTab(index) {
      this.active = index;
      this.getRoomMap(
        index === 1 ? "RoomNo" : index === 2 ? "RoomTypeID" : "Floor"
      );
    },
    getRoomMap(sort_type = "RoomNo") {
      this.roomList = [];
      this.isLoading = true;
      SystemAPI.RoomMapHandelLogic(getChainID(), sort_type).then(
        res => {
          this.isLoading = false;
          if (res.status === 200 && res.data) {
            this.roomList = res.data.map(ele => {
              let _room_class = "",
                room_text = [];
              ///1、判断房间是否可用 0：停售房间，1：可用
              if (ele.HouseKeepState == 1) {
                //判断房间是否在住CheckIn = 1,Empty = 2  原基础上“-1”。
                if (ele.CheckInState == 0) {
                  _room_class += " checkin";
                  //判断房间是否为脏房：Dirty = 3  原基础上“-1”。
                  if (ele.ClentState == 2) {
                    _room_class += " dirty";
                    room_text.push("脏");
                  }
                  //判断是否预离房
                  if (ele.IsDepart) {
                    _room_class += " readygo";
                    room_text.push("预");
                  }
                  //判断是否钟点房
                  if (
                    this.timeRoom.indexOf("," + ele.RoomRateTypeID + ",") != -1
                  ) {
                    _room_class += " parttime";
                    room_text.push("钟");
                  }
                } else {
                  //判断房间状态： Cleaning = 1,Cleaned = 2,Dirty = 3  原基础上“-1”。
                  if (ele.ClentState == 0) {
                    _room_class += " cleaning";
                  } else if (ele.ClentState == 2) {
                    _room_class += " dirty";
                  } else {
                    _room_class += " clean";
                  }
                  //判断是否预订
                  if (ele.IsBookInRoom) {
                    _room_class += " bookin";
                    room_text.push("预");
                  }
                }
              } else {
                _room_class = " stop";
                if (ele.ClentState == 2) {
                  _room_class += " dirty";
                }
              }

              //保密，VIP，检查
              var nVipTypeID = 0;
              // $.each(ele.Guest, function(i, objGuest) {
              //   nVipTypeID += objGuest.VipTypeID;
              // });
              ele.Guest.forEach(ele => {
                nVipTypeID += ele.VipTypeID;
              });
              var sShow = "";
              //取消保密房
              if (ele.Surreptitious) {
                _room_class += " CancelSalf";
                room_text.push("密");
              }
              //取消VIP房
              if (nVipTypeID > 0) {
                _room_class += " CancelVip";
                room_text.push("V");
              }
              //取消检查房
              if (ele.CheckRoomFlag) {
                _room_class += " CancelCheck";
                room_text.push("查");
              }
              //取消检查房
              if (ele.IsTeamRoom) {
                _room_class += " IsTeamRoom";
                room_text.push("团");
              }
              ele.classRoom = _room_class;
              ele.roomText = room_text;
              return ele;
            });
            this.reLoadData();
          }
        },
        err => {
          console.log("getRoomMapErr", err);
          this.isLoading = false;
        }
      );
    },
    GetParamValue() {
      SystemAPI.GetParamValueLogic(getChainID(), "TimeRoomRateTypeID")
        .then(res => {
          if (res.status === 200 && res.data) {
            this.timeRoom = `,${res.data},`;
            this.getRoomMap();
          }
        })
        .catch(err => {
          console.log("GetParamValueErr", err);
        });
    },
    reflash() {},
    dealRoom(arr) {
      if (this.radio) {
        return arr.filter(ele => ele.classRoom.indexOf(this.radio) > -1);
      } else {
        return arr;
      }
    },
    reLoadData() {
      this.$nextTick(() => {
        if (this.myScroll) {
          this.myScroll.refresh(); //在新数据DOM渲染完毕后关闭
        } else {
          this.myScroll = new IScroll(this.$refs.wrapper, {
            scrollbars: false,
            bounce: true,
            mouseWheel: true,
            probeType: 3
          });
        }
      });
    },
    selectContral(item) {
      this.contralItem = item;
      this.show = true;
      let disabledList = [];
      var sRoomState = item.classRoom;
      //空房：保密,vip
      if (sRoomState.indexOf("checkin") == -1) {
        disabledList.push("SetSalf", "CancelSalf", "SetVip", "CancelVip");
        if (sRoomState.indexOf("bookin") != -1) {
          disabledList.push("walkin");
          this.action = "booktowalkin";
        }
      }
      //在住：停用,检查
      else {
        disabledList.push("SetRepair", "SetCheck", "CancelCheck", "walkin");
        this.action = "checkin";
      }
      //干净房：干净
      if (sRoomState.indexOf("clean") != -1) disabledList.push("SetClen");
      //不是在住房
      if (sRoomState.indexOf("checkin") == -1) disabledList.push("Detail");

      //脏房：脏房
      if (sRoomState.indexOf("dirty") != -1) {
        disabledList.push("SetDiryRoom", "walkin");
        if (sRoomState.indexOf("checkin") == -1) {
          disabledList.push("Detail");
        }
      }
      //清洁房：清洁
      if (sRoomState.indexOf("cleaning") != -1)
        disabledList.push("walkin", "SetCleaning");
      //保密,VIP,检查
      disabledList.push(
        sRoomState.indexOf("CancelSalf") != -1 ? "SetSalf" : "CancelSalf"
      );
      disabledList.push(
        sRoomState.indexOf("CancelVip") != -1 ? "SetVip" : "CancelVip"
      );
      disabledList.push(
        sRoomState.indexOf("CancelCheck") != -1 ? "SetCheck" : "CancelCheck"
      );
      this.disablePower = disabledList;
    },
    showList(list) {
      return list.filter(ele => this.disablePower.indexOf(ele.code) === -1);
    },
    controlBtn(item) {
      const sOperateType = item.code;
      switch (sOperateType) {
        case "walkin":
        case "book":
          const query = {
            "action": sOperateType,
            "roomno": this.contralItem.RoomNo,
            "roomid": this.contralItem.RoomID,
            "maxcheckincount": this.contralItem.MaxCheckInCount,
            "roomname": this.contralItem.RoomNo,
            "roomtypeid": this.contralItem.RoomTypeID,
            "roomtypename": this.contralItem.RoomTypeName
          }
          console.log(sOperateType, query)
          this.$router.push({
            path: "/bookroomfolio",
            query: query
          })
          break;
        case "Detail":
          const Detailquery = {
            "action": this.action,
            "roomno": this.contralItem.RoomNo,
            "roomid": this.contralItem.RoomID,
            "maxcheckincount": this.contralItem.MaxCheckInCount,
            "roomname": this.contralItem.RoomNo,
            "roomtypeid": this.contralItem.RoomTypeID,
            "roomfolioid": this.contralItem.FolioID
          }
          this.$router.push({
            path: "/bookroomfolio",
            query: Detailquery
          })
          break;
        case "SetClen":
          this.show = false;
          this.showCheck = true;
          this.showClear = true;
          break;
        case "SetCleaning":
          this.show = false;
          this.showCheck = false;
          this.showClear = true;
          break;
        case "SetDiryRoom":
        case "SetSalf":
        case "CancelSalf":
        case "SetVip":
        case "CancelVip":
        case "SetCheck":
        case "CancelCheck":
          var data = {
            nChainID: getChainID(),
            sRoomNo: this.contralItem.RoomNo,
            sOperateType: sOperateType,
            nUserID: localStorage.getItem("user_id"),
            sUserName: localStorage.getItem("user_name")
          };
          this.RoomStatusChangeLogic(data);
          break;
        case "SetRepair":
          break;
      }
    },
    getCleanUser() {
      SystemAPI.GetUsersLogic({
        nChainID: getChainID(),
        nIdentification: 0
      })
        .then(res => {
          if (res.data != "Exception") {
            this.CleanUserList = res.data;
          }
        })
        .catch(err => {
          console.log("GetUsersLogicErr", err);
        });
    },
    getcheckUser() {
      SystemAPI.GetUsersLogic({
        nChainID: getChainID(),
        nIdentification: 1
      })
        .then(res => {
          if (res.data != "Exception") {
            this.checkUserList = res.data;
          }
        })
        .catch(err => {
          console.log("GetUsersLogicErr", err);
        });
    },
    onConfirm(value = {}) {
      this.selectClean = value;
      this.showPicker = false;
    },
    onConfirm2(value = {}) {
      this.selectCheck = value;
      this.showPicker2 = false;
    },
    toClearRoom() {
      let data = {
        nChainID: getChainID(),
        sRoomNo: this.contralItem.RoomNo,
        sOperateType: "SetCleaning",
        nUserID: localStorage.getItem("user_id"),
        sUserName: localStorage.getItem("user_name"),
        nCleanID: this.selectClean.UserID,
        sCleanName: this.selectClean.UserName
      };
      if (this.showCheck) {
        data.nCensorID = this.selectCheck.UserID;
        data.sOperateType = "SetClen";
        data.sCensorName = this.selectCheck.UserName;
      }
      this.RoomStatusChangeLogic(data);
    },
    RoomStatusChangeLogic(data, fn) {
      SystemAPI.RoomStatusChangeLogic(data)
        .then(res => {
          this.show = false;
          this.showClear = false;
          this.showPicker = false;
          this.showPicker2 = false;
          if (res.status === 200 && res.data) {
            Toast.success("设置成功");
            this.getRoomMap();
          } else {
            Toast.fail("设置失败");
          }
        })
        .catch(err => {
          Toast.fail("设置失败");
          this.show = false;
          this.showClear = false;
          this.showPicker = false;
          this.showPicker2 = false;
          console.log("RoomStatusChangeLogic", err);
        });
    }
  },
  created() {
    this.GetParamValue();
    this.getCleanUser();
    this.getcheckUser();
  },
  mounted() {
    var jdCateLeft = document.querySelector(".room-list");
    //取消事件默认动作
    jdCateLeft.addEventListener("touchmove", function(e) {
      e.preventDefault();
    });
  }
};
</script>
<style lang="less" >
#indexRoomType {
  .radio-box {
    .van-radio__label {
      line-height: 30px;
    }
    .van-radio--horizontal {
      justify-content: center;
    }
  }
  .room-list {
    .van-grid-item__content {
      justify-content: space-between;
    }
  }
//房态页面-radio的样式
@selectors: {
  dirty: @dirty;
  cleaning: @cleaning;
  stop: @stop;
  checkin: @checkin;
  // clean: @clean;
};
  each(@selectors, {
    .icon-@{key} {
      .van-icon {
        background-color: @value;
        border-color: @value;
      }
    }
    .room-list {
      .@{key} {
        .van-grid-item__content {
          background-color: @value;
          border-color: @value;
        }
      }
    }
    
  });
}
</style>
<style scoped lang="less">
#indexRoomType {
  * {
    touch-action: pan-y;
  }
  background-color: #f8f8f8;
  .i-tab-box {
    box-sizing: border-box;
    height: 44px;
    display: flex;
    background-color: #fff;
    .i-tab {
      color: #6c6c6c;
      padding: 0 0.11rem;
      font-size: 0.37333rem;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .i-tab:last-child {
      border-right: none;
    }
    .active-tab {
      color: @baseColor;
      position: relative;
    }
    .active-tab::after {
      content: "";
      position: absolute;
      bottom: -2px;
      left: 50%;
      transform: translateX(-50%);
      background-color: @baseColor;
      width: 60%;
      height: 2px;
    }
  }
  .room-list {
    margin-top: 10px;
    height: calc(100vh - 6.6rem);
    overflow: hidden;
    font-size: 12px;
    .room-num {
      margin: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
      font-weight: bold;
      width: 100%;
    }
    .room-user {
      width: 100%;
      text-align: center;
      font-weight: bold;
    }
    .room-font-box {
      display: flex;
      width: 100%;
      .room-font-item {
        color: #fff;
        background-color: @redColor;
        width: 18px;
        height: 18px;
        background-color: @redColor;
        border-radius: 50%;
        margin-right: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
  .radio-box {
    padding: 20px;
    margin: 10px 0;
    background-color: #fff;
    .van-radio--horizontal {
      justify-self: center;
    }
  }
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .block {
    width: 80%;
    min-height: 120px;
    background-color: #fff;
  }
  .clearnroom-btn {
    width: 100%;
    margin-top: 20px;
  }
}
</style>
