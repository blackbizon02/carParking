function jsDateToMysqlDatetime(jsDate) {
  const year = jsDate.getFullYear();
  const month = String(jsDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based in JavaScript
  const day = String(jsDate.getDate()).padStart(2, "0");
  const hour = String(jsDate.getHours()).padStart(2, "0");
  const minute = String(jsDate.getMinutes()).padStart(2, "0");
  const second = String(jsDate.getSeconds()).padStart(2, "0");

  const mysqlDatetime = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  return mysqlDatetime;
}

export default jsDateToMysqlDatetime;
