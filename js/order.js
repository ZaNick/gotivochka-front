//jquery плагин для масштабирования изображений
jQuery.fn.imageZoom = function (a) {var b = jQuery.extend({speed: 200,dontFadeIn: 1,hideClicked: 1,imageMargin: 15,className: "jquery-image-zoom",loading: "Loading..."}, a);return b.doubleSpeed = b.speed / 4, this.click(function (a) {if (!(1 !== a.which || a.ctrlKey || a.metaKey || a.shiftKey || a.altKey)) {var c = jQuery(a.target),d = c.is("a") ? c : c.parents("a");d = !(!d || !d.is("a") || d.attr("href").search(/(.*)\.(jpg|jpeg|gif|png|bmp|tif|tiff)(\?.*)?$/gi) == -1 && "blob:" != d.attr("href").substr(0, 5)) && d;var e = !(!d || !d.find("img").length) && d.find("img");if (d) {d.oldText = d.text(), d.setLoadingImg = function () {e ? (e.before('<span class="zoom-loader"></span>'), e.css({opacity: "0.5"})) : d.text(b.loading)}, d.setNotLoadingImg = function () {e ? (e.siblings(".zoom-loader").remove(), e.css({opacity: "1"})) : d.text(d.oldText)};var f = d.attr("href");if (jQuery("div." + b.className + ' img[src="' + f + '"]').length) return !1;var g = new Image;g.src = f;var h = function () {d.setNotLoadingImg();var a = e ? e : d,c = e ? b.hideClicked : 0,h = a.offset(),i = {width: a.outerWidth(),height: a.outerHeight(),left: h.left,top: h.top},j = jQuery('<div><img src="' + f + '" alt="" /></div>').css({position : "absolute",zIndex: "999"}).appendTo(document.body),k = {width: g.width,height: g.height},l = {width: jQuery(window).width(),height: jQuery(window).height()};if (k.width > l.width - 2 * b.imageMargin) {var m = l.width - 2 * b.imageMargin;k.height = m / k.width * k.height, k.width = m}k.left = (l.width - k.width) / 2 + jQuery(window).scrollLeft(), k.top = (l.height - k.height) / 2 + jQuery(window).scrollTop();var n = jQuery('<a href="#">Закрыть</a>').appendTo(j).hide();j.attr("tabindex", "1"), k.top < 0 && (k.top = 20), c && d.css("visibility", "hidden"), j.addClass(b.className).css(i).animate(k, b.speed, function () {n.fadeIn(b.doubleSpeed), j.focus()});var o = function () {return n.fadeOut(b.doubleSpeed, function () {j.animate(i, b.speed, function () {d.css("visibility", "visible"), j.remove()})}), !1};j.click(o), j.blur(o), n.click(o)};return g.complete ? h() : (d.setLoadingImg(), g.onload = h), !1}}})},$(document).keydown(function (a) {27 == a.keyCode && $("div.jquery-image-zoom a").click()});

//юзер меню поповер
$('#dropdownUserMenuButton').popover({
	html: true,
	placement: 'bottom',
	title: $('#dropdownUserMenu').children(".popover-header").html(),
	content: $('#dropdownUserMenu').children(".popover-body").html()
})

$('#btnMenu').click(function () {
	$('body').toggleClass('menu-opened');
	$('.nav .collapse').collapse('hide');
});

$('[href="#"], [data-toggle="collapse"]').click(function (e) {
	e.preventDefault();
});

// Загрузка содержимого в popover из DOM (страница заявка. для редактирования записей)
$(function() {
	$("[data-toggle=popover]").popover({
		html : true,
		content: function() {
			var content = $(this).attr("data-popover-content");
			return $(content).children(".popover-body").html();
		},
		title: function() {
			var title = $(this).attr("data-popover-content");
			return $(title).children(".popover-heading").html();
		}
	});
});

// зум сканов паспортов
$('.pasport-img').imageZoom();

// переключатель статистики в хедере
$('.header-info-wrap a').click(function(e) {
	e.preventDefault();
	var domId = '#' + $(this).closest('.header-info-wrap').prop('id');

	if(!$(this).hasClass('active')) {
		$(domId + ' a').removeClass('active');
		$(this).addClass('active');
		$(domId + ' .header-info-number').toggleClass('show-first show-second');
	}
});

angular.module('order', [])

.controller('mainCtrl', ['$scope', '$http', '$window', function ($scope, $http, $window) {
	$scope.files = ['one', 'two'];
}])

.directive("uploadFile", function($http) {
    return {
		scope: {
			extensions: '=extensions',
			url: '=url'
		},
		template : `
		<label class="btn btn-primary btn-sm-block" ng-hide="previewData.length">
			<span>Выбрать файлы</span>
			<input type="file" multiple accept="{{extensions}}" style="display:none" />
		</label>
		<button class="btn btn-primary btn-sm-block" ng-click="upload(previewData)" ng-show="previewData.length">
			Загрузить
		</button>
		
		<div ng-if="previewData.length">
			<div class="upload-files-list" ng-repeat="data in previewData track by $index">
				<div class="upload-file">
					<span class="upload-file-name">
						{{data.name}}
					</span>
					<span class="remove-file-btn" ng-click="remove(data)">
						<i class="icon icon-times"></i>
					</span>
				</div>
			</div>
		</div>
		`,
		link: function(scope, elem, attr) {
			var obj = new FormData();
			scope.previewData = [];	

			function previewFile(file){
				var reader = new FileReader();
				var obj = new FormData().append('file',file);
				reader.onload=function(data){
					var src = data.target.result;
					scope.$apply(function(){
						scope.previewData.push({'name':file.name,'size':file.size,'type':file.type,
						'src':src,'data':obj});
					});
				}
				console.log(obj);
				reader.readAsDataURL(file);
			}

			function uploadFile(e){
				e.preventDefault();
				var files = e.target.files;

				for(var i=0;i<files.length;i++){
					var file = files[i];
					if(file.size < 2097152) { // 2mb
						previewFile(file);
					} else {
						alert(file.name + " Файл слишком большой");
					}
				}
			}	
			elem.find('input').bind('change',function(e){
				uploadFile(e);
			});

			scope.remove=function(data){
				var index= scope.previewData.indexOf(data);
				scope.previewData.splice(index,1);
			}
			scope.upload=function(obj) {
				console.log(obj);
				$http({
					method:'POST',
					url: scope.url,
					data: obj.data,
					headers: {'Content-Type': undefined},
					transformRequest: angular.identity
				}).then(function(data){
					console.log(data);
				});
			}
		}
    };
});