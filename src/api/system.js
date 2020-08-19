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
  GetUsersLogic(data) { //获取清洁员，检察员
    return apiAxios("GET",`Logic/GetUsersLogic.ashx`, data);
  },
  GetCodeHandler(chain_id, codetype, sourceid) { //获取订单来源
    return apiAxios("POST",`Logic/GetCodeHandler.ashx?chain_id=${chain_id}&codetype=${codetype}${sourceid ? ('&sourceid=' + sourceid) :''}`);
  },
  WalkInHandler(urlquery) {
    return apiAxios("POST",`Logic/Book/WalkInHandler.ashx${urlquery}`);
  },
  BookToCheckInHandler(urlquery) {
    return apiAxios("POST",`Logic/Book/BookToCheckInHandler.ashx${urlquery}`);
  },
  AddPersonBookHandler(urlquery) {
    return apiAxios("POST",`Logic/Book/AddPersonBookHandler.ashx${urlquery}`);
  },
  GetRoomFolioHandel(chain_id, folioid, roomno) { //获取订单来源
    return apiAxios("POST",`Logic/GetRoomFolioHandel.ashx?chain_id=${chain_id}&folioid=${folioid}&roomno=${roomno}`);
  },
  ContinueStayInHandler(chain_id, folioid, dtCheckout) { //
    return apiAxios("POST",`Logic/Book/ContinueStayInHandler.ashx?chain_id=${chain_id}&folioid=${folioid}&dtCheckout=${dtCheckout}`);
  },
  GetAccTransHandler(chain_id, folioid) { //
    return apiAxios("POST",`Logic/AccTrans/GetAccTransHandler.ashx?chain_id=${chain_id}&folioid=${folioid}`);
  },
  QueryRoomRatePlanHandler(chain_id, folioid) { //
    return apiAxios("POST",`Logic/RoomRate/QueryRoomRatePlanHandler.ashx?chain_id=${chain_id}&folioid=${folioid}`);
  },
  GetRoomFolioRateHandler(chain_id, folioid, roomid) { //
    return apiAxios("POST",`Logic/GetRoomFolioRateHandler.ashx?chain_id=${chain_id}&folioid=${folioid}&roomid=${roomid}`);
  },
  GetAccItemHandler(chain_id, nItemTypeID) { //
    return apiAxios("POST",`Logic/Acctrans/GetAccItemHandler.ashx?chain_id=${chain_id}&nItemTypeID=${nItemTypeID}`);
  },
  AddTransHandler(urlquery) { //
    return apiAxios("POST",`Logic/acctrans/AddTransHandler.ashx${urlquery}`);
  },
  CheckOutRoomFolioHandler(chain_id, folioid) { //
    return apiAxios("POST",`Logic/AccTrans/CheckOutRoomFolioHandler.ashx?chain_id=${chain_id}&folioid=${folioid}`);
  },
  DeducTransHandler(chain_id, folioid, transid) { //
    return apiAxios("POST",`Logic/AccTrans/DeducTransHandler.ashx?chain_id=${chain_id}&folioid=${folioid}&transid=${transid}`);
  },
  GetAccTransBalanceHandler(chain_id, folioid) { //
    return apiAxios("POST",`Logic/AccTrans/GetAccTransBalanceHandler.ashx?chain_id=${chain_id}&folioid=${folioid}`);
  },
  CancelPersonBookHandler(chain_id, folioid) { //
    return apiAxios("POST",`Logic/Book/CancelPersonBookHandler.ashx?chain_id=${chain_id}&folioid=${folioid}`);
  },
};
export default SystemAPI;
