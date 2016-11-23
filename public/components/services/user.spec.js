describe('Users factory', function() {
  var UsersService;
  // var $provide;
  // Before each test load our api.users module
  // beforeEach(angular.mock.module('si'));
  beforeEach(module('si'));

  // Before each test set our injected Users factory (_Users_) to our local Users variable
  beforeEach(inject(function(_UserService_) {
    var $injector = angular.injector(['si']);
     UserService = $injector.get('UserService')
    //  $provide = _$provide_;
    // console.log(_UserService_);
    //  Users = $injector.get('UserService');
    // Users = _UserService_;
    //  console.debug(Users);
  }));

  // A simple test to verify the Users factory exists
  it('should exist', function() {
    expect(UserService).toBeDefined();
  });
});
