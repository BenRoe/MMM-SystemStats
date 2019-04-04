# Module: MMM-SystemStats
This [MagicMirror](https://github.com/MichMich/MagicMirror) modules, shows the processor temperature, system load, available RAM, uptime and free disk space of localhost or a remote host.

![Magic-Mirror Module MMM-SystemStats screenshot](https://raw.githubusercontent.com/BenRoe/MMM-SystemStats/master/screenshot.png)

Tested with:
- Raspberry Pi
- Ubuntu 18.04

## Dependencies
- An installation of [MagicMirror<sup>2</sup>](https://github.com/MichMich/MagicMirror)
- npm
- [async](https://www.npmjs.com/package/async)
- optional: ssh login without password on the remote host (https://www.linuxtrainingacademy.com/ssh-login-without-password/)
- optional: lm-sensors on the remote host (https://github.com/lm-sensors/lm-sensors)

## Installation

Navigate into your MagicMirror's `modules` folder:
```
cd ~/MagicMirror/modules
```

Clone this repository:
```
git clone https://github.com/BenRoe/MMM-SystemStats
```

Navigate to the new `MMM-SystemStats` folder and install the node dependencies.
```
cd MMM-SystemStats/ && npm install
```

Configure the module in your `config.js` file.

## Update the module

Navigate into the `MMM-SystemStats` folder with `cd ~/MagicMirror/modules/MMM-SystemStats` and get the latest code from Github with `git pull`.

If you haven't changed the modules, this should work without any problems. Type `git status` to see your changes, if there are any, you can reset them with `git reset --hard`. After that, git pull should be possible.

## Using the module

To use this module, add it to the modules array in the `config/config.js` file:
```javascript
modules: [
	{
		module: 'MMM-SystemStats',
		position: 'top_center', // This can be any of the regions.
		// classes: 'small dimmed', // Add your own styling. OPTIONAL.
		// header: 'System Stats', // Set the header text OPTIONAL
		config: {
			updateInterval: 10000, // every 10 seconds
			align: 'right', // align labels
			view: 'textAndIcon',
		},
	},
	{
		module: 'MMM-SystemStats',
		position: 'top_center', // This can be any of the regions.
		classes: 'small dimmed', // Add your own styling. OPTIONAL.
		header: 'Ubuntu', // Set the header text OPTIONAL
		config: {
			updateInterval: 30000, // every 30 seconds
			align: 'left', // align labels
			label: 'icon',
			host: 'hostname',
			remoteUser: 'remoteuser',
			freeSpaceCmd: "df -h|grep /dev/nvme0n1p2|awk '{print $4}'",
			freeMemCmd: "free | awk '/^Speicher:/ {print $4*100/$2}'",
			cpuTempCmd: "sensors | grep 'Package id 0'",
			cpuTempReplace:	[['Package id 0:  +',''],['(high = +100.0°C, crit = +100.0°C)','']],
		},
	},
]
```

## Configuration options

The following properties can be configured:

<table width="100%">
	<thead>
		<tr>
			<th>Option</th>
			<th width="100%">Description</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><code>updateInterval</code></td>
			<td>How often does the content needs to be fetched? (Milliseconds)
				<br><b>Possible values:</b> <code>1000</code> - <code>86400000</code>
				<br><b>Default value:</b> <code>10000</code> (10 seconds)
			</td>
		</tr>
		<tr>
			<td><code>animationSpeed</code></td>
			<td>Speed of the update animation. (Milliseconds)
				<br><b>Possible values:</b> <code>0</code> - <code>5000</code>
				<br><b>Default value:</b> <code>0</code> (animation off)
			</td>
		</tr>
		<tr>
			<td><code>language</code></td>
			<td>language id for text can be different from MM.
				<br><b>Default value:</b> <code>config.language</code>
			</td>
		</tr>
		<tr>
			<td><code>align</code></td>
			<td>Align the labels.
				<br><b>Possible values:</b> <code>left</code> or <code>right</code>
				<br><b>Default value:</b> <code>right</code>
			</td>
		</tr>
		<tr>
			<td><code>label</code></td>
			<td>Show text labels with icons, only text, or only icons.
				<br><b>Possible values:</b> <code>textAndIcon</code>, <code>text</code> or <code>icon</code>
				<br><b>Default value:</b> <code>textAndIcon</code>
			</td>
		</tr>
		<tr>
			<td><code>useSyslog</code></td>
			<td>log event to MMM-syslog?
				<br><b>Default value:</b> <code>false</code>
			</td>
		</tr>
		<tr>
			<td><code>thresholdCPUTemp</code></td>
			<td>upper-threshold for CPU Temp. If CPU Temp is more than this value, log to MMM-syslog if useSyslog=true. (celcius)
				<br><b>Default value:</b> <code>70</code>
			</td>
		</tr>
		<tr>
			<td><code>baseURLSyslog</code></td>
			<td>URL base of <a href="https://github.com/paviro/MMM-syslog">MMM-syslog module</a>
				<br><b>Default value:</b> <code>http://127.0.0.1:8080/syslog</code>
			</td>
		</tr>
		<tr>
			<td><code>host</code></td>
			<td>A name or address of the host to get the system stats from.
				<br><b>Default value:</b> <code>localhost</code>
			</td>
		</tr>
		<tr>
			<td><code>remoteUser</code></td>
			<td>The user to connect to the remote host.
				Only used for host other then localhost.
				<br><b>Default value:</b> <code>stats</code>
			</td>
		</tr>
		<tr>
			<td><code>cpuTempCmd</code></td>
			<td>
				<br><b>Default value:</b> <code>'/opt/vc/bin/vcgencmd measure_temp'</code>
			</td>
		</tr>
		<tr>
			<td><code>sysLoadCmd</code></td>
			<td>
				<br><b>Default value:</b> <code>'cat /proc/loadavg'</code>
			</td>
		</tr>
		<tr>
			<td><code>freeMemCmd</code></td>
			<td>
				<br><b>Default value:</b> <code>"free | awk '/^Mem:/ {print $4*100/$2}'"</code>
			</td>
		</tr>
		<tr>
			<td><code>upTimeCmd</code></td>
			<td>
				<br><b>Default value:</b> <code>'cat /proc/uptime'</code>
			</td>
		</tr>
		<tr>
			<td><code>freeSpaceCmd</code></td>
			<td>
				<br><b>Default value:</b> <code>"df -h|grep /dev/root|awk '{print $4}'"</code>
			</td>
		</tr>
		<tr>
			<td><code>cpuTempSplit</code></td>
			<td>
				<br><b>Default value:</b> <code>''</code>
			</td>
		</tr>
		<tr>
			<td><code>sysLoadSplit</code></td>
			<td>
				<br><b>Default value:</b> <code>' '</code>
			</td>
		</tr>
		<tr>
			<td><code>freeMemSplit</code></td>
			<td>
				<br><b>Default value:</b> <code>''</code>
			</td>
		</tr>
		<tr>
			<td><code>upTimeSplit</code></td>
			<td>
				<br><b>Default value:</b> <code>' '</code>
			</td>
		</tr>
		<tr>
			<td><code>freeSpaceSplit</code></td>
			<td>
				<br><b>Default value:</b> <code>''</code>
			</td>
		</tr>
		<tr>
			<td><code>cpuTempReplace</code></td>
			<td>
				<br><b>Default value:</b> <code>[['temp=',''],['\'','\°']]</code>
			</td>
		</tr>
		<tr>
			<td><code>sysLoadReplace</code></td>
			<td>
				<br><b>Default value:</b> <code>[]</code>
			</td>
		</tr>
		<tr>
			<td><code>freeMemReplace</code></td>
			<td>
				<br><b>Default value:</b> <code>[]</code>
			</td>
		</tr>
		<tr>
			<td><code>upTimeReplace</code></td>
			<td>
				<br><b>Default value:</b> <code>[]</code>
			</td>
		</tr>
		<tr>
			<td><code>freeSpaceReplace</code></td>
			<td>
				<br><b>Default value:</b> <code>[]</code>
			</td>
		</tr>
	</tbody>
</table>

## ToDo
- better indication for the system load
