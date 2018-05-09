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