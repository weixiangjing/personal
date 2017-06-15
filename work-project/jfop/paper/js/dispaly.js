function show3(obj) {
  var div=$(obj).parent();
  div.addClass('actv')
  div.siblings().removeClass('actv');
};
function queryMcc(str, id, name) {
  var mcc=new Object();
  mcc.pageSize = 99999;
  if(str)mcc.firstCategoryName=str;
  decorateBody(mcc);
  $.ajax({
    url: config.api + '/mcc/query',
    data: JSON.stringify(mcc),
    type: 'POST',
    dataType: 'json',
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    },
    success: function (data) {
      var arrf = [];
      for (var i = 0; i < data.data.length; i++) {
        arrf.push(data.data[i][name]);
      }
      var arr=arrf.unique();
      for (var i = 0; i < arr.length; i++) {
        $(id).append($("<option value='" + arr[i] + "'>" + arr[i] + "</option>"))
      }
    }
  })
};
function queryW(num, str1, str2, id, name,url) {
  var queryID = new Object();
  queryID.pageSize = 99999;
  if(str1)queryID.firstCategoryName=str1;
  if(str2)queryID.secondCategoryName=str2;
  queryID.resultType = num;
  decorateBody(queryID);
  $.ajax({
    url: config.api + url,
    data: JSON.stringify(queryID),
    type: 'POST',
    dataType: 'json',
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    },
    success: function (data) {
      var arrf = [];
      for (var i = 0; i < data.data.length; i++) {
        arrf.push(data.data[i][name]);
      }
      for (var i = 0; i < arrf.length; i++) {
        $(id).append($("<option value='" + arrf[i] + "'>" + arrf[i] + "</option>"))
      }
    }
  })
};