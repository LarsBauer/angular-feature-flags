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
                if (isValidFlag(flag)) {
                    flags.push(flag);
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