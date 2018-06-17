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
    language: config.language,
    units: config.units,
    useSyslog: false,
    thresholdCPUTemp: 75, // in configured units
    baseURLSyslog: 'http://127.0.0.1:8080/syslog'
  },


  getStyles: function () {
    return [
      "MMM-SystemStats.css",
    ];
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
      //console.log("this.config.useSyslog-" + this.config.useSyslog + ', this.stats.cpuTemp-'+parseInt(this.stats.cpuTemp)+', this.config.thresholdCPUTemp-'+this.config.thresholdCPUTemp);
      if (this.config.useSyslog) {
        var cpuTemp = Math.ceil(parseFloat(this.stats.cpuTemp));
        //console.log('before compare (' + cpuTemp + '/' + this.config.thresholdCPUTemp + ')');
        if (cpuTemp > this.config.thresholdCPUTemp) {
          console.log('alert for threshold violation (' + cpuTemp + '/' + this.config.thresholdCPUTemp + ')');
          this.sendSocketNotification('ALERT', {config: this.config, type: 'WARNING', message: this.translate("TEMP_THRESHOLD_WARNING") + ' (' + this.config.thresholdCPUTemp + ')' });
        }
      }
      this.stats.sysLoad = payload.sysLoad[0];
      this.stats.freeMem = Number(payload.freeMem).toFixed() + '%';
      upTime = parseInt(payload.upTime[0]);
      this.stats.upTime = moment.duration(upTime, "seconds").humanize();
      this.updateDom(this.config.animationSpeed);
    }
  },

  // Override dom generator.


  getDom: function() {
    var self = this;
    var wrapper = document.createElement('table');
    wrapper.className = "small";



    wrapper.innerHTML = '<tr class="normal">' +
                        '<td class="symbol"> <span class="fa fa-thermometer"></span></td>' +
                        '<td class="title light" style="text-align:' + self.config.align + ';">' + this.translate("CPU_TEMP") + ':&nbsp;</td>' +
                        '<td class="value bright" style="text-align:left;">' + this.stats.cpuTemp + '</td>' +
                        '</tr>' +
                        '<tr class="normal">' +
                        '<td class="symbol"><span class="fa fa-tasks"></span></td>' +
                        '<td class="title light" style="text-align:' + self.config.align + ';">' + this.translate("SYS_LOAD") + ':&nbsp;</td>' +
                        '<td class="value bright" style="text-align:left;">' + this.stats.sysLoad + '</td>' +
                        '</tr>' +
                        '<tr class="normal">' +
                        '<td class="symbol"><span class="fa fa-microchip"></span></td>' +
                        '<td class="title light" style="text-align:' + self.config.align + ';">' + this.translate("RAM_FREE") + ':&nbsp;</td>' +
                        '<td class="value bright" style="text-align:left;">' + this.stats.freeMem + '</td>' +
                        '</tr>' +
                        '<tr class="normal">' +
                        '<td class="symbol"><span class="fa fa-clock-o"></span></td>' +
                        '<td class="title light" style="text-align:' + self.config.align + ';">' + this.translate("UPTIME") + ':&nbsp;</td>' +
                        '<td class="value bright" style="text-align:left;">' + this.stats.upTime + '</td>' +
                        '</tr>';

    return wrapper;
  },
});
