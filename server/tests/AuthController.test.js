
describe('AuthController tester', function() {

    beforeEach(module('myApp'));
    var scope, $location, $controller;

    beforeEach(inject(function ($rootScope, _$controller_ ,_$location_) {
        $location = _$location_;
        scope = $rootScope.$new();
        $controller = _$controller_;

    }));

    it('should have a method to check if the path is active', function() {
        var controller = $controller('AuthController', { $scope: scope });
        $location.path('#/');
        expect($location.path()).toBe('#/');
        expect(scope.isActive('#/')).toBe(true);
        expect(scope.isActive('/')).toBe(false);
    });
});

