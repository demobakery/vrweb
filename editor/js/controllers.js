controllers
	.controller('indexCtrl', ['$scope','$rootScope','$routeParams','$document','HalloVR','$location','resolveData','$cookieStore','$timeout',
	                 function( $scope,  $rootScope,  $routeParams, $document, HalloVR,  $location,  resolveData,  $cookieStore,  $timeout){
	    $scope.halloVRObj = resolveData.obj;
	    
	    $scope.$on('$viewContentLoaded', function(){
	    	if($scope.halloVRObj.length > 0){
				$scope.$on('onRepeatLast', function(scope, element, attrs){
					HalloVR.installThree($scope.halloVRObj, $rootScope.vrweb.settings);
				})
			}else{
				$timeout(function(){
					HalloVR.installThree([], $rootScope.vrweb.settings);	
				}, 2000)
				
			}
		});

		$scope.vrContentvsvrChild = function(obj, event){
			var svg = event.currentTarget.closest("svg");
			var svgElement = event.currentTarget.closest(".vrElement");
			var mainCircle = angular.element(svg.querySelectorAll('.mainCircle path'));
			var path = angular.element(svgElement.querySelectorAll("[class^='svg_'] path"));

			angular.element(document.querySelectorAll('path')).attr('class','');

    		_.each($scope.halloVRObj, function(halloVRObj){
    			if(halloVRObj.id != obj.id){
	    			_.each(halloVRObj.content, function(content){    		
	    				content.isMargined = false;

	    				mainCircle.attr('class','');
						path.attr('class','');
	    			})
	    		}
    		})
    		
			_.each(obj.content, function(content){																																																								
				content.isMargined = content.isMargined?false:true;

				if(content.isMargined){
					mainCircle.attr('class','draw');
					path.attr('class','draw');
				}
			});

			HalloVR.hatsDown = true;				
    	};   
	}])