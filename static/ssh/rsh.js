function rsh_ret(socket, term) {
  this.socket = socket;
  this.term = term;
}

rsh_ret.prototype.close = function () {
  if (this.socket) this.socket.close();
  //if (this.term) this.term.end();
}


function run_rsh(dom_id, url, ssh_host, ssh_port, user_name, serial_number, device_id) {
  var term;
  var buf = "";
  var socket = io(url, { query: { token: serial_number, id:  device_id} });
  var ret = new rsh_ret(socket, term);

  function Rsh(argv) {
    this.argv_ = argv;
    this.io = null;
    this.pid_ = -1;
  };


  Rsh.prototype.run = function () {
    this.io = this.argv_.io.push();
    this.io.onVTKeystroke = this.sendString_.bind(this);
    this.io.sendString = this.sendString_.bind(this);
    this.io.onTerminalResize = this.onTerminalResize.bind(this);
  };

  Rsh.prototype.sendString_ = function(str) {
    socket.emit("input", str);
  };

  Rsh.prototype.onTerminalResize = function(col, row) {
    socket.emit("resize", { col: col, row: row });
  };
  socket.on("connect", function () {
    lib.init(function () {
      hterm.defaultStorage = new lib.Storage.Local();
      term = new hterm.Terminal();
      ret.term = term;
      this.term = term;
      window.term = term;
      term.decorate(document.getElementById(dom_id));

      term.setCursorPosition(0, 0);
      term.setCursorVisible(true);
      term.prefs_.set("ctrl-c-copy", true);
      term.prefs_.set("ctrl-v-paste", true);
      term.prefs_.set("use-default-window-copy", true);

      term.runCommandClass(Rsh, document.location.hash.substr(1));
      socket.emit("rsh", {
        ssh_host: ssh_host,
        ssh_port: ssh_port,
        user_name: user_name
      });

      socket.emit("resize", {
        col: term.screenSize.width,
        row: term.screenSize.height
      });
      if (buf && buf != "") {
        term.io.writeUTF16(buf);
        buf = "";
      }
    });
  });

  socket.on("output", function (data) {
    if (!term) {
      buf += data;
      return;
    }
    term.io.writeUTF16(data);
  });

  socket.on("disconnect", function () {
    console.log("Socket.io connection closed");
  });

  return ret;
}
