/**
 * Created by huise on 2017/7/7.
 */
var app = angular.module("myApp",['ngRoute']);
app.config(function($routeProvider){
    $routeProvider.when("/start",{templateUrl:"tpl/start.html"}).
        when("/main",{templateUrl:"tpl/main.html",controller:"mainCtrl"}).
        when("/details/:did",{templateUrl:"tpl/details.html",controller:"detaiCtrl"}).
        when("/submit/:oid",{templateUrl:"tpl/submit.html",controller:"subCtrl"}).
        when("/success",{templateUrl:"tpl/success.html",controller:"succCtrl"}).
        otherwise({redirectTo:"/start"});
})
app.controller("kflCtrl",["$scope","$location",function($scope,$location){
    $scope.jump = function(routeUrl){
        $location.path(routeUrl);
    }
}])
app.controller("mainCtrl",["$scope","$http",function($scope,$http){
    $scope.hasMore = true;
    $scope.searKW = true;
    $http.get("data/dish_getbypage.php").success(function(data){
        $scope.dishList = data;
    })
    $scope.loadMore = function(){
        $http.get("data/dish_getbypage.php?start="+$scope.dishList.length).success(function(data){
            //console.log(data);
            if(data.length<5){
                $scope.hasMore = false;
            }
            $scope.dishList = $scope.dishList.concat(data);
        })
    }
    $scope.searchKW = function(){
        $http.get("data/dish_getbykw.php?kw="+$scope.kw).success(function(data){
            console.log(data);
            if($scope.kw == ""){
                $scope.searKW = true;
                $http.get("data/dish_getbypage.php").success(function(data){
                    $scope.dishList = data;
                })

                $scope.hasMore = true;

            }else{
                $scope.searKW  = false;
            }

            $scope.dishList = data;
        })
    }
}])
app.controller("detaiCtrl",["$scope","$http","$routeParams",
    function($scope,$http,$routeParams){
   $http.get("data/dish_getbyid.php?did="+$routeParams.did).success(function(data){
       console.log(data);
       $scope.dish = data[0];
   })
    }
])
app.controller("subCtrl",["$scope","$http","$routeParams","$httpParamSerializerJQLike",function($scope,$http,$routeParams, $httpParamSerializerJQLike){

    $scope.confirm = true;
    $scope.mySub = function(){
        $scope.confirm = false;
       var formcontent = {
           user_name:$scope.user_name,
           sex:$scope.sex,
           phone:$scope.phone,
           addr:$scope.addr,
           did:$routeParams.oid
       }
        var resolut = $httpParamSerializerJQLike(formcontent);
        console.log(resolut);
        $http.get("data/order_add.php?"+resolut).success(function(data){
            console.log(data);
            if(data.msg == "success"){
                $scope.orderId ="订餐成功！您的订单编号为："+data.oid+"。您可以在用户中心查看订单状态";
            sessionStorage.setItem("phone",$scope.phone);

            }else{
                $scope.orderId ="订餐失败"
            }

        })

    }
}])
app.controller("succCtrl",["$scope","$http",function($scope,$http){
           $http.get("data/order_getbyphone.php?phone="+ sessionStorage.getItem("phone")).success(function(data){
               console.log(data);
               $scope.myOrder = data;
           })


}])