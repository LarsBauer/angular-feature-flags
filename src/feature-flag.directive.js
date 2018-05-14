(function () {
    'use strict';

    angular
        .module('feature-flags')
        .directive('featureFlag', featureFlag);

    /* @ngInject */
    function featureFlag(featureFlags) {
        // Usage:
        // <div feature-flag feature-id="myFeature" invert></div>
        //
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