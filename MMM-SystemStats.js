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
    align: 'right',
    language: config.language
  },

  // Define required scripts.
	getScripts: function () {
    return ["moment.js", "moment-duration-format.js"];
	},

  // Define required translations.
	getTranslations: function() {
    return {
      'en': 'translations/en.json',
      'id': 'translations/id.json'
    };
	},

  // Define start sequence
  start: function() {
    Log.log('Starting module: ' + this.name);

    // set locale
    moment.locale(this.config.language);

    this.stats = {};
    this.stats.cpuTemp = this.translate('LOADING').toLowerCase();
    this.stats.sysLoad = this.translate('LOADING').toLowerCase();
    this.stats.freeMem = this.translate('LOADING').toLowerCase();
    this.stats.upTime = this.translate('LOADING').toLowerCase();
    this.sendSocketNotification('CONFIG', this.config);
  },

  socketNotificationReceived: function(notification, payload) {
    //Log.log('MMM-SystemStats: socketNotificationReceived ' + notification);
    //Log.log(payload);
    if (notification === 'STATS') {
      this.stats.cpuTemp = payload.cpuTemp;
      this.stats.sysLoad = payload.sysLoad[0];
      this.stats.freeMem = Number(payload.freeMem).toFixed() + '%';
      upTime = parseInt(payload.upTime[0]);
      console.log("upTime : " + payload.upTime[0] + " - " + upTime);
      this.stats.upTime = moment.duration(upTime, "seconds").humanize();
      this.updateDom(this.config.animationSpeed);
    }
  },

  // Override dom generator.
  getDom: function() {
    var self = this;
    var wrapper = document.createElement('table');

    wrapper.innerHTML = '<tr>' +
                        '<td class="title" style="text-align:' + self.config.align + ';">' + this.translate("CPU_TEMP") + ':&nbsp;</td>' +
                        '<td class="value" style="text-align:left;">' + this.stats.cpuTemp + '</td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td class="title" style="text-align:' + self.config.align + ';">' + this.translate("SYS_LOAD") + ':&nbsp;</td>' +
                        '<td class="value" style="text-align:left;">' + this.stats.sysLoad + '</td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td class="title" style="text-align:' + self.config.align + ';">' + this.translate("RAM_FREE") + ':&nbsp;</td>' +
                        '<td class="value" style="text-align:left;">' + this.stats.freeMem + '</td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td class="title" style="text-align:' + self.config.align + ';">' + this.translate("UPTIME") + ':&nbsp;</td>' +
                        '<td class="value" style="text-align:left;">' + this.stats.upTime + '</td>' +
                        '</tr>';

    console.log(wrapper.innerHTML);
    return wrapper;
  },
});
