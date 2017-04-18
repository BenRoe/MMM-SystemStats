# Module: MMM-SystemStats
This [MagicMirror](https://github.com/MichMich/MagicMirror) modules, shows the processor temperature, system load and available RAM.

![Magic-Mirror Module MMM-SystemStats screenshot](https://raw.githubusercontent.com/BenRoe/MMM-SystemStats/master/screenshot.png)

Tested with:
- Raspberry Pi

## Dependencies
- An installation of [MagicMirror<sup>2</sup>](https://github.com/MichMich/MagicMirror)
- npm
- [async](https://www.npmjs.com/package/async)

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
		classes: 'small dimmed', // Add your own styling. Optional.
		config: {
			updateInterval: 10000,
			animationSpeed: 0,
			align: 'right', // align labels
			//header: 'System Stats', // This is optional
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
			<td><code>useSyslog</code></td>
			<td>log event to MMM-syslog?
				<br><b>Default value:</b> <code>false</code>
			</td>
		</tr>
		<tr>
			<td><code>thresholdCPUTemp</code></td>
			<td>upper-threshold for CPU Temp. If CPU Temp is more than this value, log to MMM-syslog if useSyslog=true. (celcius)
				<br><b>Default value:</b> <code>75</code>
			</td>
		</tr>
		<tr>
			<td><code>baseURLSyslog</code></td>
			<td>URL base of <a href="https://github.com/paviro/MMM-syslog">MMM-syslog module</a>
				<br><b>Default value:</b> <code>http://127.0.0.1:8080/syslog</code>
			</td>
		</tr>
	</tbody>
</table>

## ToDo
- icons
- sd-card available space
- better indication for the system load
