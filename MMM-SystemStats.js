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
    baseURLSyslog: 'http://127.0.0.1:8080/syslog',
    label: 'textAndIcon'
  },
  // Define required styles.
  getStyles: function() {
    return ["font-awesome.css"];
  },
  // Define required scripts.
	getScripts: function () {
      return ["moment.js", "moment-duration-format.js"];
	},

  // Define required translations.
	getTranslations: function() {
    return {
      'en': 'translations/en.json',
      'fr': 'translations/fr.json',
      'id': 'translations/id.json',
      'de': 'translations/de.json'
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
    this.stats.freeSpace = this.translate('LOADING').toLowerCase();
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
          this.sendSocketNotification('ALERT', {config: this.config, type: 'WARNING', message: this.translate("TEMP_THRESHOLD_WARNING") + ' (' + this.stats.cpuTemp + '/' + this.config.thresholdCPUTemp + ')' });
        }
      }
      this.stats.sysLoad = payload.sysLoad[0];
      this.stats.freeMem = Number(payload.freeMem).toFixed() + '%';
      upTime = parseInt(payload.upTime[0]);
      this.stats.upTime = moment.duration(upTime, "seconds").humanize();
      this.stats.freeSpace = payload.freeSpace;
      this.updateDom(this.config.animationSpeed);
    }
  },

  // Override dom generator.
  getDom: function() {
    var self = this;
    var wrapper = document.createElement('table');

    var sysData = {
      cpuTemp: {
        text: 'CPU_TEMP',
        icon: 'fa-thermometer',
      },
      sysLoad: {
        text: 'SYS_LOAD',
        icon: 'fa-tachometer',
      },
      freeMem: {
        text: 'RAM_FREE',
        icon: 'fa-microchip',
      },
      upTime: {
        text: 'UPTIME',
        icon: 'fa-clock-o',
      },
      freeSpace: {
        text: 'DISK_FREE',
        icon: 'fa-hdd-o',
      },
    };

    Object.keys(sysData).forEach(function (item){
      var row = document.createElement('tr');

      if (self.config.label.match(/^(text|textAndIcon)$/)) {
        var c1 = document.createElement('td');
        c1.setAttribute('class', 'title');
        c1.style.textAlign = self.config.align;
        c1.innerText = self.translate(sysData[item].text);
        row.appendChild(c1);
      }

      if (self.config.label.match(/^(icon|textAndIcon)$/)) {
        var c2 = document.createElement('td');
        c2.innerHTML = `<i class="fa ${sysData[item].icon} fa-fw"></i>`;
        row.appendChild(c2);
      }

      var c3 = document.createElement('td');
      c3.setAttribute('class', 'value');
      c3.style.textAlign = self.config.align;
      c3.innerText = self.stats[item];
      row.appendChild(c3);

      wrapper.appendChild(row);
    });

    return wrapper;
  },
});
