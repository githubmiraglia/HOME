// JavaScript Document

function server(){
  this.xml = new XMLHttpRequest();
}

server.prototype.promiseToGet = function(method, query){
  var myserver = this;
  return new Promise(function(resolve, reject){
    myserver.get(method, query, function(error, result){
      if (error) reject(error);
      else resolve(result);
    });
  });
};

server.prototype.get = function(method, query, f){
  this.xml.onreadystatechange = function(){
    if (this.xml.readyState === 4){
      if (this.xml.status === 200){
        return f(null, this.xml.responseText);
      } else {
        return f(new Error("could not connect with server"), null);
      }
    }
  }.bind(this);

  let url = "";

  // -------- TOP SCORES --------
  if (query.query === "JSON" && query.table === "topscores") {
    url = `/api/topscores?${query.field}=${query.data}`;
  }

  // -------- FALLBACK (optional debug) --------
  else {
    console.error("Unknown query", query);
    return f(new Error("Unknown query"), null);
  }

  this.xml.open("GET", url, true);
  this.xml.send();
};

server.prototype.readJSON = function(table, field, data){
  let q = { query: "JSON", table, field, data };
  return this.promiseToGet("GET", q);
};