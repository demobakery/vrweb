var app = angular.module('vrweb', ['ngRoute', 'ngCookies', 'ngAnimate','ngSanitize', 'ngMaterial', 'controllers']);
var controllers = angular.module('controllers',[]);

app.config(['$locationProvider','$routeProvider', function ( $locationProvider,  $routeProvider) {
      $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
      });
       $routeProvider
            .when("/editor",{
                templateUrl: 'editor/tpl/index.html'
                , controller: 'indexCtrl'
                , resolve: {
                    resolveData: function($route,$q,$location,$http, $rootScope){
                        var deferred = $q.defer();
                        $rootScope.vrweb.editable = true;
                        $http.get('/db/empty.json').success(function(response) {

                            // if(response.length > 0){
                            //     _.each(response, function(halloVRObj){
                            //         _.each(halloVRObj.content, function(content){
                            //             content.d = "M500 500 L" + (content.x + 5)+ " " + (content.y + 5); 

                            //             if(content.vrChildren.length) {
                            //                 _.each(content.vrChildren, function(vrChild){       

                            //                     vrChild.d = "M500 500 L" + (500 + vrChild.x + 5)+ " " + (500 + vrChild.y + 5);  

                            //                 })
                            //             }
                            //         })
                            //     })
                            // }

                            deferred.resolve({ obj: response});
                            
                        })
                        .error(function(error){
                            console.log('error', error)
                            deferred.reject();
                        });
                        

                        return deferred.promise;
                    }
                }
            })
            .otherwise({ redirectTo: '/' }); 
    }
]);


app.run(['$rootScope','$window','$cookieStore', function ($rootScope,  $window,  $cookieStore) {   
    // config
    $rootScope.vrweb = {
        editable: false, 
        form: false,
        controller: false,
        settings: {
            hatImage: 'assets/hat.png',
            bgImage: 'assets/picsart.jpg',
            container: 'container'
        }
    }
    $rootScope.halloVRItems = [];

    $rootScope.$on('$routeChangeSuccess', function (event, data) {
        /* set controller class on view container */
        if (data && data.$$route && data.$$route.controller) $rootScope.vrweb.controller = data.$$route.controller;
    });  
}]);