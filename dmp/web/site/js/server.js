// JavaScript Document

function server() {
	this.xml = new XMLHttpRequest();
}

server.prototype.promiseToGet = function (method, query) {
	var myserver = this;
	return new Promise(function (resolve, reject) {
		myserver.get(method, query, function (error, result) {
			if (error) reject(error);
			else resolve(result);
		});
	});
};

server.prototype.get = function (method, query, f) {
	this.xml.onreadystatechange = function () {
		if (this.xml.readyState === 4) {
			if (this.xml.status === 200) {
				return f(null, this.xml.responseText);
			} else {
				return f(new Error("Could not connect with backend"), null);
			}
		}
	}.bind(this);

	let url = "/api";
	let payload = null;

	// -------- USERS --------
	if (query.query === "exist") {
		url = `/api/users/exists?field=${query.field}&value=${query.data}`;
	}

	else if (query.query === "INSERT") {
		url = "/api/users";
		payload = {
			userName: query.userName,
			email: query.email,
			password: query.password
		};
	}

	else if (query.query === "UPDATE") {
		url = `/api/users/${query.currentUser}`;
		payload = {
			userName: query.userName,
			email: query.email,
			password: query.password
		};
	}

	// -------- SCORES / GENERIC TABLE --------
	else if (query.table) {
		url = `/api/${query.table}`;
	}

	// -------- REQUEST --------
	this.xml.open(method, url, true);

	if (payload && (method === "POST" || method === "PUT")) {
		this.xml.setRequestHeader("Content-Type", "application/json");
		this.xml.send(JSON.stringify(payload));
	} else {
		this.xml.send();
	}
};

server.prototype.readJSON = function (table, field, data) {
	let q = { query: "JSON", table: table, field: field, data: data };
	return this.promiseToGet("GET", q);
};