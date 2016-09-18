# Module: MMM-SystemStats
This [MagicMirror](https://github.com/MichMich/MagicMirror) modules, shows the processor temperature, system load and available RAM.

Tested with:
- Raspberry Pi

## Installation

Navigate into your MagicMirror's `modules` folder:
````
cd ~/MagicMirror/modules
````

Clone this repository:
````
git clone https://github.com/BenRoe/MMM-SystemStats
````

Configure the module in your `config.js` file.

## Using the module

To use this module, add it to the modules array in the `config/config.js` file:
````javascript
modules: [
	{
		module: 'MMM-SystemStats',
		position: 'top_center', // This can be any of the regions.
		classes: 'small dimmed', // Add your own styling. Optional.
		config: {
			updateInterval: 10000,
			animationSpeed: 0,
			//header: 'System Stats', // This is optional
		},
	},
]
````

## Configuration options

The following properties can be configured:

<table width="100%">
	<!-- why, markdown... -->
	<thead>
		<tr>
			<th>Option</th>
			<th width="100%">Description</th>
		</tr>
	<thead>
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

	</tbody>
</table>
