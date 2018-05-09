;(function() {
"use strict";

angular
    .module('feature-flags', []);
    
angular
    .module('feature-flags')
    .provider('featureFlags', featureFlagsProvider);

function featureFlagsProvider() {
    var initialFlags = [];
    var p = this;

    p.init = init;
    p.$get = featureFlagsFactory

    ///////////////

    /**
     * initializes the provider with the given flags
     * @param {array} newFlags an array of flags
     */
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

        /**
         * adds a new flag to the flags array
         * @param {object} newFlag the new flag
         */
        function addFlag(newFlag) {
            if (isValidFlag(flag)) {
                flags.push(flag);
            }
        }

        /**
         * adds an array of flags to the flags array
         * @param {Array} newFlags an array of flags to add
         */
        function addFlags(newFlags) {
            if (Array.isArray(newFlags)) {
                newFlags.forEach(function (flag) {
                    addFlag(flag);
                });
            }
        }

        /**
         * retrieves the flag with the given flag id from the flags array
         * @param {string} flagId the id of the flag
         * @returns {object} the flag or undefined if no matching flag is found
         */
        function getFlag(flagId) {
            return flags.find(function (flag) {
                return flag.id === flagId;
            });
        }

        /**
         * retrieves all flags
         * @returns the flags array
         */
        function getAllFlags() {
            return flags;
        }

        /**
         * returns the status of the flag with the given id
         * @param {string} flagId the id of the flag
         * @returns {boolean} the status of the provided flag, false if the flag does not exist 
         */
        function getFlagStatus(flagId) {
            var target = getFlag(flagId);

            return target && target.active !== undefined ? target.active : false;
        }

        /**
         * sets the status of the flag with the given id
         * @param {string} flagId the id of the flag
         * @param {boolean} newStatus the new status for the given flag
         */
        function setFlagStatus(flagId, newStatus) {
            var target = getFlag(flagId);

            if (target && typeof newStatus === 'boolean') {
                target.active = newStatus;
                //TODO broadcast?
            }
        }

        /**
         * removes the flag with the given id from the flags array
         * @param {string} flagId the id of the flag to remove
         */
        function removeFlag(flagId) {
            var index = flags.indexOf(function (flag) {
                return flag.id === flagId;
            });

            if (index !== -1) {
                flags.splice(index, 1);
                //TODO broadcast?
            }
        }

        /**
         * removes all flags from the array
         */
        function removeAllFlags() {
            flags = [];
        }

        /**
         * determines based on the given flag ids whether the route should activate
         * @param {array} flagIds the ids of the flag
         * @returns {promise} promise which gets resolved if all provided flags are enabled and rejected if one is disabled
         */
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

        /**
         * checks if the given flag is in the valid format and does not exist already
         * @param {object} flag the flag to validate
         * @returns {boolean} the validity of the flag
         */
        function isValidFlag(flag) {
            return typeof flag.id === 'string' && typeof flag.active === 'boolean' && !isDuplicate(flag);
        }

        /**
         * checks if the given flag is a duplicate
         * @param {object} newFlag the flag to check
         * @returns {boolean} the duplicate status of the flag
         */
        function isDuplicate(newFlag) {
            return flags.find(function (flag) {
                return flag.id === newFlag.id;
            }) !== undefined;
        }
    }
}
angular
    .module('feature-flags')
    .directive('featureFlag', featureFlag);

featureFlag.$inject = ['featureFlags'];

function featureFlag(featureFlags) {
    // Usage:
    // <div feature-key="myFeature" invert></div>
    // Creates:
    //
    var directive = {
        link: link,
        restrict: 'A',
        scope: {
            featureKey: '=',
            invert: '='
        }
    };
    return directive;

    function link(scope, element, attrs) {
        var isVisible = featureFlags.getFlagStatus(scope.featureKey);
        scope.invert ? !isVisible : isVisible;
        isVisible ? element.removeClass('ng-hide') : element.addClass('ng-hide');
    }
}
}());
