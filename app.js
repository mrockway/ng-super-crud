var app = angular.module("crudApp", ["ngRoute", "ngResource"]);

// Routes
app.config(["$routeProvider", "$locationProvider", function ($routeProvider, $locationProvider)  {
  $routeProvider
    .when("/", {
      templateUrl: "templates/books/index.html",
      controller: "BooksIndexCtrl"
    })
    .when("/books/:id", {
    	templateUrl: "templates/books/show.html",
    	controller: "BooksShowCtrl"
    });

  $locationProvider
  	.html5Mode({
  		enabled: true,
  		requireBase: false
  	});
}]);

app.factory("Book", ["$resource", function ($resource) {
	return $resource("https://super-crud.herokuapp.com/books/:id", {id: "@_id"}, {
		query: {
			isArray: true,
      transformResponse: function(data) { return angular.fromJson(data).books; }
		},
		update: { method: 'PUT'}
	});
}]);

// Controllers
app.controller("BooksIndexCtrl", ["$scope", "Book", function ($scope, Book){
	$scope.allBooks = Book.query();

	$scope.addBook = function() {
		Book.save($scope.newBook);
		$scope.allBooks.push($scope.newBook);
		$scope.newBook = {};
	};
}]);

app.controller("BooksShowCtrl", ["$scope", "Book", "$routeParams", '$location', function ($scope, Book, $routeParams, $location){
	var bookId = $routeParams.id;
	book = Book.get({ id: bookId},
		function(data) {
			$scope.book = data;
		},
		function(error) {
			$location.path('/');
		}
	);
	$scope.alterBook = function() {
		Book.update({id: bookId}, $scope.editBook, function(data) {
			$location.path('/');
		});
	};

	$scope.deleteBook = function() {
		Book.delete({id: bookId});
		$location.path('/');
	};
}]);