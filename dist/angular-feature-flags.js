/**
 * angular-feature-flags - 
 * @version v1.0.0
 * @link https://github.com/LarsBauer/angular-feature-flags#readme
 * @license MIT
 */
(function () {
    'use strict';

    angular.module('feature-flags', []);
})();
(function () {
    'use strict';

    angular
        .module('feature-flags')
        .provider('featureFlags', featureFlagsProvider);

    function featureFlagsProvider() {
        var initialFlags = [];

        var p = this;
        p.init = init;
        p.$get = featureFlagsFactory;

        ///////////////

        function init(newFlags) {
            if (Array.isArray(newFlags)) {
                initialFlags = newFlags
            }
        }

        featureFlagsFactory.$inject = ['$q'];

        function featureFlagsFactory($q) {
            return featureFlags($q, initialFlags);
        }

        function featureFlags($q, providedFlags) {
            var flags = providedFlags;

            var service = {
                addFlag: addFlag,
                addFlags: addFlags,
                getFlag: getFlag,
                getAllFlags: getAllFlags,
                getFlagStatus: getFlagStatus,
                setFlagStatus: setFlagStatus,
                removeFlag: removeFlag,
                removeAllFlags: removeAllFlags,
                resolveRoute: resolveRoute
            };

            return service;

            ////////////////

            function addFlag(newFlag) {
                if (isValidFlag(newFlag)) {
                    flags.push(newFlag);
                }
            }

            function addFlags(newFlags) {
                if (Array.isArray(newFlags)) {
                    newFlags.forEach(function (flag) {
                        addFlag(flag);
                    });
                }
            }

            function getFlag(flagId) {
                return flags.find(function (flag) {
                    return flag.id === flagId;
                });
            }

            function getAllFlags() {
                return flags;
            }

            function getFlagStatus(flagId) {
                var target = getFlag(flagId);

                return target && target.active !== undefined ? target.active : false;
            }

            function setFlagStatus(flagId, newStatus) {
                var target = getFlag(flagId);

                if (target && typeof newStatus === 'boolean') {
                    target.active = newStatus;
                }
            }

            function removeFlag(flagId) {
                var index = flags.indexOf(function (flag) {
                    return flag.id === flagId;
                });

                if (index !== -1) {
                    flags.splice(index, 1);
                }
            }

            function removeAllFlags() {
                flags = [];
            }

            function resolveRoute(flagIds) {
                return $q(function (resolve, reject) {
                    if (Array.isArray(flagIds)) {
                        for (var i = 0; i < flagIds.length; i++) {
                            var isActive = getFlagStatus(flagIds[i]);
                            if (!isActive) {
                                // do not activate route
                                reject();
                                break;
                            }
                        }
                    }

                    // activate route
                    resolve();
                });
            }

            function isValidFlag(flag) {
                return typeof flag.id === 'string' && typeof flag.active === 'boolean' && !isDuplicate(flag);
            }

            function isDuplicate(newFlag) {
                return flags.find(function (flag) {
                    return flag.id === newFlag.id;
                }) !== undefined;
            }
        }
    }
})();
(function () {
    'use strict';

    angular
        .module('feature-flags')
        .directive('featureFlag', featureFlag);

    featureFlag.$inject = ['featureFlags'];

    function featureFlag(featureFlags) {
        // Usage:
        // <div feature-flag feature-key="myFeature" invert></div>
        // Creates:
        //
        var directive = {
            link: link,
            restrict: 'A',
            scope: {
                featureKey: '@',
                invert: '@'
            }
        };
        return directive;

        function link(scope, element, attrs) {
            determineVisibility();

            scope.$watchGroup(['featureKey', 'invert'], function (newVal, oldVal, scope) {
                determineVisibility();
            });

            function determineVisibility() {
                var isVisible = featureFlags.getFlagStatus(scope.featureKey);
                isVisible = scope.invert !== undefined ? !isVisible : isVisible;
                isVisible ? element.removeClass('ng-hide') : element.addClass('ng-hide');
            }
        }
    }
})();