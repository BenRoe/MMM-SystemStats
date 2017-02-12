/* global Module */

/* Magic Mirror
 * Module: MMM-SystemStats
 *
 * By Benjamin Roesner http://benjaminroesner.com
 * MIT Licensed.
 */

Module.register('MMM-SystemStats', {

  defaults: {
    updateInterval: 10000,
    animationSpeed: 0,
  },

  // Define start sequence
  start: function() {
    //Log.log('Starting module: ' + this.name);
    this.stats = {};
    this.stats.cpuTemp = this.translate("LOADING").toLowerCase();
    this.stats.sysLoad = this.translate("LOADING").toLowerCase();
    this.stats.freeMem = this.translate("LOADING").toLowerCase();
    this.sendSocketNotification('CONFIG', this.config);
  },

  socketNotificationReceived: function(notification, payload) {
    //Log.log('MMM-SystemStats: socketNotificationReceived ' + notification);
    //Log.log(payload);
    if (notification === 'STATS') {
      this.stats.cpuTemp = payload.cpuTemp;
      this.stats.sysLoad = payload.sysLoad[0];
      this.stats.freeMem = Number(payload.freeMem).toFixed() + '%';
      this.updateDom(this.config.animationSpeed);
    }
  },

  // Override dom generator.
  getDom: function() {
    var wrapper = document.createElement('table');

    wrapper.innerHTML = '<tr>' +
                        '<td class="title" style="text-align:right;">CPU Temp: </td>' +
                        '<td class="value" style="text-align:left;">' + this.stats.cpuTemp + '</td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td class="title" style="text-align:right;">System Load: </td>' +
                        '<td class="value" style="text-align:left;">' + this.stats.sysLoad + '</td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td class="title" style="text-align:right;">Free RAM: </td>' +
                        '<td class="value" style="text-align:left;">' + this.stats.freeMem + '</td>' +
                        '</tr>';

    return wrapper;
  },
});
