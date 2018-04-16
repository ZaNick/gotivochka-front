angular.module('list', [])

.controller('mainCtrl', ['$scope', '$http', '$window', function ($scope, $http, $window) {
	$http.get("creditsList.json").then(function (res) {
		$scope.creditsList = res.data;
		// console.log($scope.creditsList);
		// console.log($scope.pager);
		$scope.filteredList = $scope.creditsList;
	});
	$scope.filterCount = 0;
	
	$scope.filter = {};
	$scope.filter.index = null;
	$scope.filter.status = [];
	$scope.filter.productId = [];
	
	$scope.filteringList = function() {
		$scope.unSelectAll(); // снимаем галки у всех элементов

		let filters = {};
		for (const fltrProp in $scope.filter) {
			if ($scope.filter.hasOwnProperty(fltrProp)) {
				const fltrValue = $scope.filter[fltrProp];
				// console.log(fltrProp);
				// console.log(fltrValue);
				if(fltrValue == null || fltrValue.length == 0) {
					continue;
				}
				if(Array.isArray(fltrValue)) {
					var tArr = fltrValue.filter(x => {return x !== false});
					if(tArr.length > 0) {
						filters[fltrProp] = tArr;
					}
					continue;
				}
				filters[fltrProp] = [fltrValue];
			}
		}
		console.log(filters);
		$scope.filteredList = $scope.multiFilter($scope.creditsList, filters);

		console.log($scope.filteredList);
		$('html, body').animate({
			scrollTop: $('#ListResult').offset().top
		}, 300);
		
		$scope.filterCount = $('.filtered').length;
	};

	$scope.multiFilter = function(array, filters) {
		const filterKeys = Object.keys(filters);
		return array.filter((item) => {
			return filterKeys.every(function(key) {
				if(filters[key].length == 1 && angular.isString(filters[key][0])) // условие для поиска части строки, или элемента массива
					return item[key].toLowerCase().indexOf(filters[key][0].toLowerCase()) !== -1;
				else
					return filters[key].indexOf(item[key]) !== -1;
			});
		});
	}

	$scope.searchPresets = {
		activePreset: '',
		all: function() {
			this.activePreset = 'all';
			$scope.resetFilter();
		},
		accepted: function() {
			this.activePreset = 'accepted';
			$scope.filter = {};
			$scope.unSelectAll();
			$scope.filter.status = ['Одобрен'];
			$scope.filteringList();
		},
		onWait: function() {
			this.activePreset = 'onWait';
			$scope.filter = {};
			$scope.unSelectAll();
			$scope.filter.status = ['На рассмотрении'];
			$scope.filteringList();
		},
		declined: function() {
			this.activePreset = 'declined';
			$scope.filter = {};
			$scope.unSelectAll();
			$scope.filter.status = ['Отказ'];
			$scope.filteringList();
		}
	}

	$scope.resetFilter = function() {
		$scope.filter = {};
		$scope.filter.index = null;
		$scope.filter.status = [];
		$scope.filter.productId = [];
		$scope.unSelectAll();
		$scope.filteringList();
	}


	$scope.isNumber = angular.isNumber;


	/* сортировка */
	$scope.propertyName = 'index';
	$scope.reverse = false;
  
	$scope.sortBy = function(propertyName, sortDirection) {
		$scope.reverse = sortDirection;
		$scope.propertyName = propertyName;
	};
	$scope.headerClass = function (propertyName, sortDirection) {
		if($scope.reverse == sortDirection && $scope.propertyName == propertyName)
			return true;
		else
			return false;
	}
	/* /сортировка */

	/* пагинация */
	$scope.pager = {
		pageSize: 10,
		currentPage: 1,
		getCurrentPage: function() {
			// это для того, чтобы первая страница была равна 1, а не 0
			return this.pageSize * this.currentPage - this.pageSize;
		},
		getTotalPages: function() {
			if($scope.filteredList != undefined)
				return Math.ceil($scope.filteredList.length / this.pageSize);
			else
				return false;
		},
		setPage: function(page) {
			this.currentPage = page;
			console.log(this.currentPage + ' of ' + this.getTotalPages());
		},
		pagesList: function() {
			var startPage, endPage, pageArr = [];
			var totalPages = this.getTotalPages();
			var currentPage = this.currentPage;

			if (totalPages <= 10) {
				startPage = 1;
				endPage = totalPages;
			} else {
				if (currentPage <= 6) {
					startPage = 1;
					endPage = 10;
				} else if (currentPage + 4 >= totalPages) {
					startPage = totalPages - 9;
					endPage = totalPages;
				} else {
					startPage = currentPage - 5;
					endPage = currentPage + 4;
				}
			}
			for(var i = startPage; i <= endPage; i++) {
				pageArr.push(i);
			}
			return pageArr;
		}
	};
	/* /пагинация */

	$scope.toggleAll = function() {
		var action = null;
		$scope.allSelected == true ? action = true : action = false;

		$scope.filteredList.forEach(element => {
			element.active = action;
		});
	}
	$scope.unSelectAll = function() {
		$scope.filteredList.forEach(element => {
			element.active = false;
		});
		$scope.allSelected = false;
	}
	
	$scope.checkSelected = function() {
		$scope.allSelected = $scope.filteredList.every(element => {return element.active == true});
		$scope.someSelected = $scope.filteredList.some(element => {return element.active == true});
		console.log($scope.allSelected);

		if($scope.allSelected)
			$('#allSelected').prop('indeterminate', false);
		else if($scope.someSelected)
			$('#allSelected').prop('indeterminate', true);
		else
			$('#allSelected').prop('indeterminate', false);
	}
}]);


//юзер меню поповер
$('#dropdownUserMenuButton').popover({
	html: true,
	placement: 'bottom',
	title: $('#dropdownUserMenu').children(".popover-header").html(),
	content: $('#dropdownUserMenu').children(".popover-body").html()
})

$('.input-daterange').datepicker({
	format: "dd.mm.yyyy",
	language: "ru"
});

$('#btnMenu').click(function () {
	$('body').toggleClass('menu-opened');
	$('.nav .collapse').collapse('hide');
});

$('[href="#"], [data-toggle="collapse"]').click(function (e) {
	e.preventDefault();
});

$('[data-stat-nav]').click(function() {
	let id = $(this).data('stat-nav');
	$(this).closest('.header-info-wrap').find('[data-stat-id]').removeClass('show-data');
	$('[data-stat-id="' + id + '"]').addClass('show-data');

	$(this).closest('.header-info-wrap').find('[data-stat-nav]').removeClass('active');
	$(this).addClass('active');

	// console.log($('[data-stat-id="' + id + '"]'));
});