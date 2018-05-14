/**
 * angular-feature-flags - A simple AngularJS module that provides a range of functionalities to control the visbility of components and the access to specific areas of your application via feature flags.
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
        featureFlagsFactory.$inject = ['$q'];
        var initialFlags = [];

        var p = this;
        p.init = init;
        p.$get = featureFlagsFactory;

        ///////////////

        /**
         * @description initializes the featureFlagsProvider with the given array of feature flag objects
         * @param {Array} newFlags the feature feature flag objects
         */
        function init(newFlags) {
            if (Array.isArray(newFlags)) {
                initialFlags = newFlags
            }
        }

        /* @ngInject */
        function featureFlagsFactory($q) {
            return featureFlags($q, initialFlags);
        }

        function featureFlags($q, providedFlags) {
            var flags = providedFlags;

            var service = {
                getFlag: getFlag,
                getFlags: getFlags,
                setFlag: setFlags,
                setFlags: setFlags,
                deleteFlag: deleteFlag,
                deleteFlags: deleteFlags,
                isActive: isActive,
                guardRoute: guardRoute
            };

            return service;

            ////////////////

            /**
             * @description retrieves the given feature flag object
             * @param {string} flagId the id of the feature flag
             * @returns the feature flag object or undefined if no matching feature flag was found
             */
            function getFlag(flagId) {
                return flags.find(function (flag) {
                    return flag.id === flagId;
                });
            }

            /**
             * @description retrieves all feature flag objects
             * @returns {Array} the configured feature flags
             */
            function getFlags() {
                return flags;
            }

            /**
             * @description sets the given feature flag object. 
             * if a feature flag with this id already exists it will be updated, otherwise a new entry will be added to the list.
             * @param {Object} newFlag the feature flag object
             */
            function setFlag(newFlag) {
                if (isValidFlag(newFlag)) {
                    var index = getFlagIndex(newFlag.id);

                    if (index == -1) {
                        // new flag
                        flags.push(newFlag);
                    } else {
                        // update existing flag
                        flags[index] = newFlag;
                    }
                }
            }

            /**
             * @description sets a list of given feature flag objects.
             * if a feature flag with this id already exists it will be updated, otherwise a new entry will be added to the list.
             * @param {Array} newFlags the feature flag objects
             */
            function setFlags(newFlags) {
                if (Array.isArray(newFlags)) {
                    newFlags.forEach(function (flag) {
                        setFlag(flag);
                    });
                }
            }

            /**
             * @description deletes the given feature flag object
             * @param {string} flagId the id of the feature flag to delete
             */
            function deleteFlag(flagId) {
                var index = getFlagIndex(flagId);

                if (index !== -1) {
                    flags.splice(index, 1);
                }
            }

            /**
             * @description deletes all feature flag objects
             */
            function deleteFlags() {
                flags = [];
            }

            /**
             * @description returns the status of the given feature flag
             * @param {string} flagId the id of the feature flag
             * @returns {boolean} the status of the provided feature flag 
             * if the feature flag does not exist false will be returned.
             */
            function isActive(flagId) {
                var flag = getFlag(flagId);

                return flag && flag.active !== undefined ? flag.active : false;
            }

            /**
             * @description checks whether all required feature flags of a route are active
             * @param {Array} flagIds the ids of the feature flags required for the route
             * @returns {Promise} a promise which gets resolved if all of the required feature flags for this route are active
             */
            function guardRoute(flagIds) {
                return $q(function (resolve, reject) {
                    if (Array.isArray(flagIds)) {
                        for (var i = 0; i < flagIds.length; i++) {
                            if (!isActive(flagIds[i])) {
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

            /**
             * @description helper method used to get index of the given feature flag
             * @param {string} flagId the id of the feature flag
             * @returns {number} the index or -1 if no matching entry was found
             */
            function getFlagIndex(flagId) {
                return flags.find(function (flag) {
                    return flag.id === flagId;
                });
            }

            /**
             * @description helper method used to validate a given feature flag object
             * @param {Object} flag the feature flag object
             * @returns {boolean} the validity of the feature flag object
             */
            function isValidFlag(flag) {
                return typeof flag.id === 'string' && typeof flag.active === 'boolean';
            }
        }
    }
})();
(function () {
    'use strict';

    featureFlag.$inject = ['featureFlags'];
    angular
        .module('feature-flags')
        .directive('featureFlag', featureFlag);

    /* @ngInject */
    function featureFlag(featureFlags) {
        // Usage:
        // <div feature-flag feature-id="myFeature" invert-feature-flag></div>
        var directive = {
            link: link,
            restrict: 'A',
            scope: {
                featureId: '@',
                invertFeatureFlag: '@'
            }
        };
        return directive;

        function link(scope, element, attrs) {
            determineVisibility();

            scope.$watchGroup(['featureId', 'invertFeatureFlag'], function (newVal, oldVal, scope) {
                determineVisibility();
            });

            function determineVisibility() {
                var isVisible = featureFlags.isActive(scope.featureKey);
                isVisible = scope.invertFeatureFlag !== undefined ? !isVisible : isVisible;
                isVisible ? element.removeClass('ng-hide') : element.addClass('ng-hide');
            }
        }
    }
})();