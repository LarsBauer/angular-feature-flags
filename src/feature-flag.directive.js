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

        scope.$watchGroup(['featureKey', 'invert'],function (newVal, oldVal, scope) {
            determineVisibility();
        });

        function determineVisibility() {
            var isVisible = featureFlags.getFlagStatus(scope.featureKey);
            isVisible = scope.invert !== undefined ? !isVisible : isVisible;
            isVisible ? element.removeClass('ng-hide') : element.addClass('ng-hide');
        }
    }
}