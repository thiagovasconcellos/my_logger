Log library that I made to use whenever I was too lazy to 'console.log' everything.
Generate a .json instead with a little more information about users environment.

First of all you have to manually set the locations of the logs using 'setPath':

```bash
yarn add tcv_logger
```

```js
import { default as Logger } from 'tcv_logger';
import Path from 'path';

const path = Path.resolve(__dirname, 'logs');
Logger.setPath(path);
```
This will set ~/src/logs your default logging storage.

Then, all you have to do is use info or error to generate .json logs

```js
import Logger from 'tcv_logger';

async function Foobar(){
  
  try {
    const response = await api.get('https://foo/bar/json/')
    Logger.info({response})
  } catch (error) {
    Logger.error({error})
  }
}
```

Note that each method expects an object as a parameter. The output should look like that:

```json
{
	"log_type": "ERROR",
	"cpu_arc": "x64",
	"platform": "linux - Linux",
	"hostname": "CBYK-83",
	"home_dir": "/home/user",
	"cpus": "false",
	"network_interfaces": "false",
	"timestamp": "2020-03-09 14:39:29",
	"data": [
		{
			"error": {
				"message": "connect EHOSTUNREACH ",
				"name": "Error",
				"stack": "Error: connect EHOSTUNREACH \n    at TCPConnectWrap.afterConnect [as oncomplete] (net.js:1137:16)",
				"config": {
					"url": "https://foo/bar/json/",
					"method": "get",
					"headers": {
						"Accept": "application/json, text/plain, */*",
						"User-Agent": "axios/0.19.2"
					},
					"transformRequest": [
						null
					],
					"transformResponse": [
						null
					],
					"timeout": 0,
					"xsrfCookieName": "XSRF-TOKEN",
					"xsrfHeaderName": "X-XSRF-TOKEN",
					"maxContentLength": -1
				},
				"code": "EHOSTUNREACH"
			}
		}
	]
}
```

By default, CPUs and NetworkInterfaces logs are set to false.
To change that, simple do:

```js
Logger.setCpuLogs(true);
Logger.setNetworkInterfacesLogs(true);
```
