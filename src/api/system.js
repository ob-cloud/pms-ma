import apiAxios from "@/common/axios";
const SystemAPI = {
  LoginHandelLogic(username, password) {
    return apiAxios("POST",`Logic/LoginHandelLogic.ashx?user_name=${username}&user_pass=${password}`);
  },
  ChainDetailsHandelLogic(chainId, accDate, action) {
    return apiAxios("POST",`Logic/ChainDetailsHandelLogic.ashx?chain_id=${chainId}&acc_date=${accDate}&action=${action}`);
  },
  RoomStatusCountHandelLogic(chainId) {
    return apiAxios("POST",`Logic/RoomStatusCountHandelLogic.ashx?chain_id=${chainId}`);
  },
  RoomMapHandelLogic(chainId, sort_type) {
    return apiAxios("POST",`Logic/RoomMapHandelLogic.ashx?chain_id=${chainId}&sort_type=${sort_type}`);
  },
  GetParamValueLogic(chainId, eSysParam) {
    return apiAxios("Get",`Logic/GetParamValueLogic.ashx?nChainID=${chainId}&eSysParam=${eSysParam}`);
  },
  RevenueHandelLogic(chainId, date) { //营收分析
    return apiAxios("POST",`Logic/RevenueHandelLogic.ashx?chain_id=${chainId}&acc_date_begin=${date}&acc_date_end=${date}`);
  },
  RevenueRptHandelLogic(chainId, date) { //营收分析Echart数据
    return apiAxios("POST",`Logic/RevenueRptHandelLogic.ashx?chain_id=${chainId}&acc_date_begin=${date}&acc_date_end=${date}`);
  },
  StatisticsHandelLogic(chainId, date) { //经营分析
    return apiAxios("POST",`Logic/StatisticsHandelLogic.ashx?chain_id=${chainId}&acc_date_begin=${date}&acc_date_end=${date}`);
  },
  StatisticsRptHandelLogic(chainId, date) { //经营分析Echart数据
    return apiAxios("POST",`Logic/StatisticsRptHandelLogic.ashx?chain_id=${chainId}&acc_date_begin=${date}&acc_date_end=${date}`);
  },
  GetRoomFolioListHanler(chainId, date, state) { //获取订单列表
    return apiAxios("POST",`Logic/GetRoomFolioListHanler.ashx?chain_id=${chainId}&acc_date=${date}&pageno=1&pagesize=10000&state=${state}`);
  },
  GetRoomTypeHandler(chainId) { //获取房型
    return apiAxios("POST",`Logic/GetRoomTypeHandler.ashx?chain_id=${chainId}`);
  },
  GetRoomRateTypeListHandler(chainId) { //获取房价类型
    return apiAxios("POST",`Logic/RoomRate/GetRoomRateTypeListHandler.ashx?chain_id=${chainId}`);
  },
  RoomRateBatchSetHandler(chain_id, beginaccDate, endaccDate, roomTypeID, roomRateTypeID, dRoomRate, roomRateID) { //设置房价
    return apiAxios("POST",`Logic/RoomRate/RoomRateBatchSetHandler.ashx?chain_id=${chain_id}&beginaccDate=${beginaccDate}&endaccDate=${endaccDate}&roomTypeID=${roomTypeID}&roomRateTypeID=${roomRateTypeID}&sourceID=0&dRoomRate=${dRoomRate}&roomRateID=${roomRateID}`);
  },
  GetRoomRateListByConditionHandler(chain_id, accdate, nRoomTypeID, nRoomRateTypeID) { //获取当前房价
    return apiAxios("POST",`Logic/RoomRate/GetRoomRateListByConditionHandler.ashx?chain_id=${chain_id}&accdate=${accdate}&nRoomTypeID=${nRoomTypeID}&nRoomRateTypeID=${nRoomRateTypeID}&nSourceID=0`);
  },
  RoomStatusChangeLogic(data) { //通用设置方法
    return apiAxios("GET",`Logic/RoomStatusChangeLogic.ashx`, data);
  },
  GetUsersLogic(data) { //通用设置方法
    return apiAxios("GET",`Logic/GetUsersLogic.ashx`, data);
  },
};
export default SystemAPI;
