var bode = angular.module('main',['ngRoute']);
bode.config(function($routeProvider){
    $routeProvider
        .when('/',{
        controller: 'MainControl',
        templateUrl: 'input.html'
        
    })
        .when('/about',{
        controller:'',
        templateUrl:'about.html'
        
    })
    
        .when('/feedback',{
        controller:'',
        templateUrl:'feedback.html'
        
    })
                       
                       
                       
})
bode.factory('Factory',function(){
    var fact  ={};
    fact.titles =[ 'English language',
  'Mathematics',
  'Literature in English',
  'Chemistry',
  'Physics',
  'Biology',
  'Government',
  'Computer Studies',
  'Agricultural science',
  'Economics',
  'French language',
  'Geography',
  'Further mathematics',
  'CRS/IRS' ];
    fact.grades = ['A1','B2','B3','C4','C5','C6','D7','E8','F9'];
    return fact;
    
})
bode.controller('NavCtrl',['$scope','$location',function($scope,$location){
    $scope.navTab='n';
    $scope.setNavTab = function(val){
        $scope.navTab = val;
    }
    if($scope.navTab == 'n') $location.path('/')
    
    
}]);
bode.controller('MainControl',['$scope','$http','Factory',function($scope,$http,factory){
    $scope.mine = {university:'',
                   course:'',
                   aggregate:0,
                   jamb_score:'',
                   subjects:
                   []}
    $scope.entered =false;
    $http.get('/universities').success(function(res){
       console.log(res);
       $scope.u = res;
    })
    $scope.new={name: '', grade: ''}
    $scope.This = function(uni){
       for(var i in $scope.u){
           if($scope.u[i].university == uni)
               return $scope.u[i];
       }
       return null
    }
    $scope.titles = factory.titles;
    $scope.grades =factory.grades;
    $scope.setuni = function(u){
        $scope.mine.university = u;
    }
    $scope.setc = function(u){
        $scope.mine.course = u;
    }
    $scope.setName = function(a){
        $scope.new.name =a;
        
    }
    $scope.setGrade = function(a){
        $scope.new.grade =a;
        
    }
    $scope.Add = function(a){
        if(In(a.name,$scope.titles) && !(In(a)) && In(a.grade,$scope.grades) && a.subjects.length !=5){
            var b ={name: a.name,grade: a.grade}
            $scope.mine.subjects.push(b);
            $scope.new={name: '', grade: ''}
            
        }else if($scope.mine.subjects.length ==5){
            alert('maximum subject');
            $scope.new={name: '', grade: ''}
        }
        
    }
    $scope.e = function(a){
        if(a || !this.entered)
            return '';
        return 'has-error'
    }
    function In(a,b){
        if(typeof a == 'object'){
            for(var i in $scope.mine.subjects){
                if(a.name == $scope.mine.subjects[i].name)
                    return true;
            }
        }else{
        for(var i in b){
            if(a == b[i])
                return true;
        }
        }
        return false;
    }
    $scope.Aggregate = function(){
        Post($scope.mine,GetPoints);
    } 
    var Post = function(a,funct){
       if(a.university && a.course && a.jamb_score && a.subjects.length==5){
           
            var subjscore = 0;
            var j = parseFloat(a.jamb_score)/8;
            for(var i in a.subjects)
                subjscore+=funct(a.subjects[i].grade);
            $scope.info = '';
            a.aggregate = j + subjscore;
            console.log(a)
            $scope.info = "";
            $http.post('/p',a).success(function(res){
                
            })
       }else if(!(a.course) || !(a.university)){
           
           $scope.info = " Incomplete field!!!";
          
       }
        else{
            $scope.info= " Five subjects required";

            a.aggregate = 0;
       }
           
    }
    $scope.Remove = function(subject){
        $scope.mine.subjects.splice($scope.mine.subjects.indexOf(subject),1);
    } 
    var GetPoints= function(grade){
        return 10-$scope.grades.indexOf(grade);
        
    }
}]);