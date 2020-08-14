function checkVal(val) {//判断是否有权限
  var arrusers = window.localStorage.getItem("LoginResult");
  if (arrusers == null || arrusers == "") return false;
  var res = JSON.parse(arrusers);
  // var role_list = res[2];
  // for (var i in role_list) {
  //     if (role_list[i] == val) return true;
  // }
  return (res[2].indexOf(val) > -1)
}
function getChainID() {
  if (window.localStorage.getItem("chain_id") == undefined || window.localStorage.getItem("chain_id") == "") {
      //window.location.href = "login.html";
  } else {
      return window.localStorage.getItem("chain_id");
  }
}
export {
  checkVal,
  getChainID
}