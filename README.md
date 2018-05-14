# angular-feature-flags
angular-feature-flags is a simple AngularJS module that provides a range of functionalities to control the visbility of components and the access to specific areas of your application via [feature flags](https://en.wikipedia.org/wiki/Feature_toggle).
## Installation & Configuration
1. Download the latest release
2. Include `angular-feature-flags.js` (for development use) or `angular-feature-flags.min.js` (for production use) in your html __after__ AngularJS
3. Add `featureFlags` to your module's dependencies list
```javascript
angular
    .module('app', ['featureFlags']);
```
4. Initialize the `featureFlagsProvider` in the config function of your module
```javascript
angular
    .module('app')
    .config(config);

/* @ngInject */
function config(featureFlagsProvider) {
    var myFeatures = [
        { id: 'myFeature', active: true },
        { id: 'myHiddenFeature', active: false }
    ];

    featureFlagsProvider.init(myFeatures);
}
```
## Usage
The `featureFlags` module comes with two components:
* a `feature-flag` directive to toggle the visible parts of your application based on configured feature flags
* a `featureFlags` service to store, retrieve and update feature flags at runtime
### Toggling elements
To toggle the visibility of html elements just add the `feature-flag` directive to this element and provide the `feature-id` attribute of the required feature.
```html
<div feature-flag feature-id="myFeature">
    I will be hidden if 'myFeature' is inactive
</div>
```
You can invert the visibility by adding the `invert-feature-flag` attribute to the element.
```html
<div feature-flag feature-id="myFeature" invert-feature-flag>
    I will be hidden if 'myFeature' is active
</div>
```
### Guarding routes
To prevent a route from being activated based on the provided feature flags configuration you can inject the `featureFlags` service into the `resolve` function when configuring the routes of your application.

The function `guardRoute` takes an array of feature flags as parameter and returns a [Promise](https://docs.angularjs.org/api/ng/service/$q). It checks each of the required features and if one is inactive the Promise will be rejected so that the route will not be activated (see [routeProvider](https://docs.angularjs.org/api/ngRoute/provider/$routeProvider) for details).
```javascript
angular
    .module('app')
    .config(config);

/* @ngInject */
function config($routeProvider, featureFlagsProvider) {
    // featureFlagsProvider config goes here (see above for details)

    $routeProvider
        .when('/MyHiddenFeature', {
            templateUrl: 'myHiddenFeature.html',
            controller: 'MyController',
            resolve: {
                guardRoute: guardRoute(['myHiddenfeature'])
            }
        });
}

function guardRoute(requiredFeatures) {
    /* @ngInject */
    function onResolve(featureFlags) {
        return featureFlags.guardRoute(requiredFeatures);
    }

    return onResolve;
}
```
## API
_TODO_
## Credits
This module is heavily inspired by:
* [angular-simple-feature-flags](https://github.com/costacruise/angular-simple-feature-flags)
* [angular-feature-flags](https://github.com/michaeltaranto/angular-feature-flags)
## License
MIT License

Copyright (c) 2018 Lars Bauer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
