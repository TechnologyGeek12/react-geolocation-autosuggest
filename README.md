# react-geolocation-autosuggest
React Google location auto-suggest/autocomplete to provide all possible information with fields like Country, State, City, Pin-code etc.


<img src="https://img.shields.io/badge/Licence-MIT-blue.svg" alt="Licence" data-canonical-src="https://img.shields.io/badge/Licence-MIT-blue.svg" style="max-width:100%;"/>
<img src="https://img.shields.io/badge/Version-0.1.1-brightgreen.svg" alt="npm Version" data-canonical-src="https://img.shields.io/badge/Version-0.1.1-brightgreen.svg" style="max-width:100%;"/>

A Node.js React package that gives Google map location api based autocomplete/autosuggest dropdown to search and select location from autosuggested places. It also give you the other useful information like Country, State, City, Pin-code with the fields as well and can be customise as per user requirment, rest information like street_number, lat, long etc can be seen in onSelect method along with above.

![Geolocation displeyInline false image](https://github.com/TechnologyGeek12/react-geolocation-autosuggest/blob/master/src/displayInlineFalse.png)
![Geolocation displeyInline image](https://github.com/TechnologyGeek12/react-geolocation-autosuggest/blob/master/src/displayInlineTrue.png)

Click [here](https://technologygeek12.github.io/react-geolocation-autosuggest/) for live [demo](https://technologygeek12.github.io/react-geolocation-autosuggest/)

# Installation
The package can be installed via NPM:
```javascript
npm install react-geolocation-autosuggest --save

yarn add react-geolocation-autosuggest
```
react-geolocation-autosuggest can be imported as follows

```javascript
var GeoLocation = require('react-geolocation-autosuggest');

OR

import GeoLocation from 'react-geolocation-autosuggest';

```

# Prerequisite
You need to include your Google map API key to you app. Somewhere in index.html.

`<script src="https://maps.googleapis.com/maps/api/js?key=[YOUR_API_KEY]&libraries=places"></script>`

Visit Google's API documentation to get your [Google API key](https://developers.google.com/maps/documentation/).

## User will get these Output/data in onSelect method of GeoLocation

```javascript
{"street_number":"2235",
"route":"5th Avenue",
"locality":"New York",
"administrative_area_level_1":"New York",
"country":"United States",
"postal_code":"10037",
"lat":40.8131697,
"lng":-73.93705539999996,
"description":"2235 5th Avenue, New York, NY, USA",
"countryFullDetail":{
    "long_name":"United States",
    "short_name":"US",
    "types":["country","political"]
    },
"stateFullDetail":{
    "long_name":"New York",
    "short_name":"NY",
    "types":["administrative_area_level_1","political"]
    },
"cityFullDetail":{
    "long_name":"New York",
    "short_name":"New York",
    "types":["locality","political"]
    }
}
```

# Examples

## Basic Example with all default props

```jsx
import React, { Component } from 'react';
import GeoLocation from 'react-geolocation-autosuggest';

class App extends Component {

    render() {
        return (
            <div className="App" >
                <GeoLocation/>
            </div>
        );
    }
}

export default App;

```

## Example to pass preSelectedValue/default value to address search field and fill all other fields

```javascript
import React, { Component } from 'react';
import GeoLocation from 'react-geolocation-autosuggest';

class App extends Component {

    render() {
        return (
            <div className="App" >
                <GeoLocation
                 preSelectedValue={'Avenida Corrientes 2252, Buenos Aires, Argentina'}
                 // pass a valid address for better/exact match
                />
            </div>
        );
    }
}

export default App;
```

## Example to show use of onSelect And onChange method

```jsx
import React, { Component } from 'react';
import GeoLocation from 'react-geolocation-autosuggest';

class App extends Component {


    onSelect = (data) => {
        //console.log('data after selection', data);
    }

    onChange = (data) => {
        //console.log('data whenever change occour', data);
    }

    render() {
        return (
            <div className="App" >
                    <GeoLocation
                        onSelect={this.onSelect}
                        onChange={this.onChange} />
            </div>
        );
    }
}

export default App;

```

## Example to remove all other fields(Country, State, City, Pin-code)

```javascript
import React, { Component } from 'react';
import GeoLocation from 'react-geolocation-autosuggest';

class App extends Component {

    render() {
        return (
            <div className="App" >
                <GeoLocation
                    showAllFields={false}
                />
            </div>
        );
    }
}

export default App;
```

## Example to show only specific fields as per requirment from Country, State, City, Pin-code

```javascript
import React, { Component } from 'react';
import GeoLocation from 'react-geolocation-autosuggest';

class App extends Component {

    render() {
        return (
            <div className="App" >
                <GeoLocation
                    showAllFields={false}
                    isCountryVisible={true}
                    isStateVisible={true}
                />
            </div>
        );
    }
}

export default App;
```

## Example to disable(non-editable) all fields(Country, State, City, Pin-code)

```javascript
import React, { Component } from 'react';
import GeoLocation from 'react-geolocation-autosuggest';

class App extends Component {

    render() {
        return (
            <div className="App" >
                <GeoLocation
                    isAllDisabled={true}
                />
            </div>
        );
    }
}

export default App;
```

## Example to disable specific field(Country, State, City, Pin-code)

```javascript
import React, { Component } from 'react';
import GeoLocation from 'react-geolocation-autosuggest';

class App extends Component {

    render() {
        return (
            <div className="App" >
                <GeoLocation
                    isAllDisabled={false}
                    isCityDisabled={true}
                    isPinCodeDisabled={true}
                />
            </div>
        );
    }
}

export default App;
```

## Example to show all fields in seprate row with full width(Country, State, City, Pin-code)

```javascript
import React, { Component } from 'react';
import GeoLocation from 'react-geolocation-autosuggest';

class App extends Component {

    render() {
        return (
            <div className="App" >
                <GeoLocation
                    displayInline={false}
                />
            </div>
        );
    }
}

export default App;
```

## Example to pass labelText, errorText, and key(react key can help to update component if want in particular condition)

```javascript
import React, { Component } from 'react';
import GeoLocation from 'react-geolocation-autosuggest';

class App extends Component {

    render() {
        return (
            <div className="App" >
                <GeoLocation
                 errorText={}
                 countryLabelText={'Country'}
                 stateLabelText={'State'}
                 cityLabelText={'City'}
                 pincodeLabelText={'Pin code'}
                 key={'autosuggestAddressSearch'}
                />
            </div>
        );
    }
}

export default App;
```

## Style prop

You can create custom fields styles using the material-ui theme creator as all the fields are of material ui so all material-ui(v3.9.2) property can be applied.

```javascript
import React, { Component } from 'react';
import GeoLocation from 'react-geolocation-autosuggest';
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
    typography: {
        useNextVariants: true,
    },
    overrides: {
        MuiInput: {
            underline: {
                "&&&&:hover:before": {
                    borderBottom: "1px solid rgba(0, 0, 0, 0.42)"
                },
                "&&&&:after": {
                    borderBottom: "2px solid #2196f3"
                },
                // borderBottom: "1px solid #2196f3"
            }
        },
        MuiFormLabel: {
            root: {
                color: "blue",
                "&$focused": {
                    "&$focused": {
                        "color": "#2196f3"
                    }
                }
            },
        }
    }
});

class App extends Component {

    render() {
        return (
            <div className="App" >
                <MuiThemeProvider theme={theme}>
                    <GeoLocation/>
                </MuiThemeProvider>
            </div>
        );
    }
}

export default App;
```

# Default parameter options value
```javascript
    showAllFields: true,
    isAllDisabled: false,
    isCountryVisible: false,
    isStateVisible: false,
    isCityVisible: false,
    isPinCodeVisible: false,
    isCountryDisabled: false,
    isStateDisabled: false,
    isCityDisabled: false,
    isPinCodeDisabled: false,
    displayInline: true,
    addressLabelText: 'Search Address...',
    errorText: '',
    countryLabelText:'Country',
    stateLabelText:'State',
    cityLabelText:'City',
    pincodeLabelText:'Pin code',
    key:'autosuggestAddressSearch',
    preSelectedValue: ''
```

# Available options list
```javascript
    showAllFields: Boolean,
    isAllDisabled: Boolean,
    isCountryVisible: Boolean,
    isStateVisible: Boolean,
    isCityVisible: Boolean,
    isPinCodeVisible: Boolean,
    isCountryDisabled: Boolean,
    isStateDisabled: Boolean,
    isCityDisabled: Boolean,
    isPinCodeDisabled: Boolean,
    displayInline: Boolean, 
    addressLabelText: String,
    errorText: String,
    countryLabelText: String,
    stateLabelText: String,
    cityLabelText: String,
    pincodeLabelText: String,
    key: String, 
    preSelectedValue: String,
    onSelect: Function,
    onChange: Function     
```
