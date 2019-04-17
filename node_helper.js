'use strict';

/* Magic Mirror
 * Module: MMM-SystemStats
 *
 * By Benjamin Roesner http://benjaminroesner.com
 * MIT Licensed.
 */

const NodeHelper = require('node_helper');
var async = require('async');
var exec = require('child_process').exec;
var request = require('request');

module.exports = NodeHelper.create({
  start: function() {
    //console.log('Starting node helper: ' + this.name);
	this.config = {};
  },

  // Subclass socketNotificationReceived received.
  socketNotificationReceived: function(notification, payload) {
    var self = this;

    if (notification === 'REQUEST_SYSTEM_STATS') {
      self.getStats(payload);
    }
    else if (notification === 'ALERT') {
      this.config = payload.config;
      // notify syslog
      //console.log('url : ' + payload.config.baseURLSyslog);
      request({ url: payload.config.baseURLSyslog + '?type=' + payload.type + '&message=' + encodeURI(payload.message), method: 'GET' }, function(error, response, body) {
        console.log("notif MMM-syslog with response " + response.statusCode);
      });
    }
  },

  getStats: function(config) {
    var self = this;
	var sshCommand = "";


	if(config.host !== 'localhost') {
		sshCommand = "ssh " + config.remoteUser + "@" + config.host + " ";
	}
	
	var cmdCpuTemp =	sshCommand + config.cpuTempCmd;
	var cmdSysLoad =	sshCommand + config.sysLoadCmd;
	var cmdFreeMem =	sshCommand + config.freeMemCmd;
	var cmdUpTime =		sshCommand + config.upTimeCmd;
	var cmdFreeSpace =	sshCommand + config.freeSpaceCmd;
	
    async.parallel([
      // get cpu temp
      async.apply(exec, cmdCpuTemp),
      // get system load
      async.apply(exec, cmdSysLoad),
      // get free ram in %
      async.apply(exec, cmdFreeMem),
      // get uptime
      async.apply(exec, cmdUpTime),
      // get free-space
      async.apply(exec, cmdFreeSpace),

    ],
    function (err, res) {
      var stats = {};
      stats.id =		config.id;
      stats.cpuTemp =	self.formatData(res[0][0],config.cpuTempSplit,config.cpuTempReplace);
      stats.sysLoad =	self.formatData(res[1][0],config.sysLoadSplit,config.sysLoadReplace);
      stats.freeMem =	self.formatData(res[2][0],config.freeMemSplit,config.freeMemReplace);
      stats.upTime =	self.formatData(res[3][0],config.upTimeSplit,config.upTimeReplace);
      stats.freeSpace =	self.formatData(res[4][0],config.freeSpaceSplit,config.freeSpaceReplace);
      // console.log(stats);
      self.sendSocketNotification('RESPONSE_SYSTEM_STATS', stats);
    });
  },


  formatData: function(data, spl, repl) {
	if(spl !== '') {
	  data = data.split(spl);
	}
	for(var i = 0; i < repl.length; i++) {
	  data = data.replace(repl[i][0],repl[i][1])
	}
	return data;
  },

  // http://unix.stackexchange.com/questions/69185/getting-cpu-usage-same-every-time/69194#69194

});
