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

module.exports = NodeHelper.create({
  start: function() {
    //console.log('Starting node helper: ' + this.name);
  },

  // Subclass socketNotificationReceived received.
  socketNotificationReceived: function(notification, payload) {
    var self = this;

    if (notification === 'CONFIG') {
      this.config = payload;
      setInterval(function() {
        self.getStats();
      }, this.config.updateInterval);
    }

  },

  getStats: function() {
    var self = this;

    async.parallel([
      // get cpu temp
      async.apply(exec, '/opt/vc/bin/vcgencmd measure_temp'),
      async.apply(exec, 'cat /proc/loadavg'),
      // get free ram in %
      async.apply(exec, "free | awk '/^Mem:/ {print $4*100/$2}'"),
      // get used ram in %
      // async.apply(exec, 'free | awk '/^Mem:/ {print $3*100/$2}''),

    ],
    function (err, res) {
      var stats = {};
      stats.cpuTemp = self.formatCpuTemp(res[0][0]);
      stats.sysLoad = res[1][0].split(' ');
      stats.freeMem = res[2][0];
      // console.log(stats);
      self.sendSocketNotification('STATS', stats);
    });
  },

  formatCpuTemp: function(temp) {
    return temp.replace('temp=','').replace('\'','\°');
  },

  // http://unix.stackexchange.com/questions/69185/getting-cpu-usage-same-every-time/69194#69194

});
