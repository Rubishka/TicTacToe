
describe("AuthService test", function () {
    var AuthService, httpBackend;

    beforeEach(module('myApp'));

    beforeEach(inject(function (_AuthService_, $httpBackend) {
        AuthService = _AuthService_;
        httpBackend = $httpBackend;
    }));
    describe('registeration', function () {
    it("should register and check if user status is true", function () {
        AuthService.whenGET('/user/status', {username: 'rub', password: '1'})
            .respond(
                {data:{status: 'true'}}
            )
    });

    it("try to log", function () {
        AuthService.login('rub', '1').then(function (data) {
            expect(data.status).toEqual(true);
        });
        httpBackend.flush();
    });

    it("try to register", function () {
        AuthService.register("rub",'1').then(function(data) {
            expect(data.status).toEqual(false);
        });
        httpBackend.flush();
    });
    });

});