//jquery плагин для масштабирования изображений
jQuery.fn.imageZoom = function (a) {var b = jQuery.extend({speed: 200,dontFadeIn: 1,hideClicked: 1,imageMargin: 15,className: "jquery-image-zoom",loading: "Loading..."}, a);return b.doubleSpeed = b.speed / 4, this.click(function (a) {if (!(1 !== a.which || a.ctrlKey || a.metaKey || a.shiftKey || a.altKey)) {var c = jQuery(a.target),d = c.is("a") ? c : c.parents("a");d = !(!d || !d.is("a") || d.attr("href").search(/(.*)\.(jpg|jpeg|gif|png|bmp|tif|tiff)(\?.*)?$/gi) == -1 && "blob:" != d.attr("href").substr(0, 5)) && d;var e = !(!d || !d.find("img").length) && d.find("img");if (d) {d.oldText = d.text(), d.setLoadingImg = function () {e ? (e.before('<span class="zoom-loader"></span>'), e.css({opacity: "0.5"})) : d.text(b.loading)}, d.setNotLoadingImg = function () {e ? (e.siblings(".zoom-loader").remove(), e.css({opacity: "1"})) : d.text(d.oldText)};var f = d.attr("href");if (jQuery("div." + b.className + ' img[src="' + f + '"]').length) return !1;var g = new Image;g.src = f;var h = function () {d.setNotLoadingImg();var a = e ? e : d,c = e ? b.hideClicked : 0,h = a.offset(),i = {width: a.outerWidth(),height: a.outerHeight(),left: h.left,top: h.top},j = jQuery('<div><img src="' + f + '" alt="" /></div>').css({position : "absolute",zIndex: "999"}).appendTo(document.body),k = {width: g.width,height: g.height},l = {width: jQuery(window).width(),height: jQuery(window).height()};if (k.width > l.width - 2 * b.imageMargin) {var m = l.width - 2 * b.imageMargin;k.height = m / k.width * k.height, k.width = m}k.left = (l.width - k.width) / 2 + jQuery(window).scrollLeft(), k.top = (l.height - k.height) / 2 + jQuery(window).scrollTop();var n = jQuery('<a href="#">Закрыть</a>').appendTo(j).hide();j.attr("tabindex", "1"), k.top < 0 && (k.top = 20), c && d.css("visibility", "hidden"), j.addClass(b.className).css(i).animate(k, b.speed, function () {n.fadeIn(b.doubleSpeed), j.focus()});var o = function () {return n.fadeOut(b.doubleSpeed, function () {j.animate(i, b.speed, function () {d.css("visibility", "visible"), j.remove()})}), !1};j.click(o), j.blur(o), n.click(o)};return g.complete ? h() : (d.setLoadingImg(), g.onload = h), !1}}})},$(document).keydown(function (a) {27 == a.keyCode && $("div.jquery-image-zoom a").click()});

$(document).ready(function () {
	sliderGallery.init();
	filterCount();
});

$(function () {
	$('[data-toggle="tooltip"]').tooltip();
});

$('#filterForm .form-row input').on('input change', function() {
	filterCount();
});

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

//юзер меню поповер
$('#dropdownUserMenuButton').popover({
	html: true,
	placement: 'bottom',
	title: $('#dropdownUserMenu').children(".popover-header").html(),
	content: $('#dropdownUserMenu').children(".popover-body").html()
})

// слайдер на главной странице
var sliderGallery = function () {
	var gallery = '#statSlider',
		slider = false,
		brPoint = 992;
	var init = function () {
		check();
		$(window).resize(function () {
			check();
		});
	};

	var check = function() {
		if (window.innerWidth >= brPoint && slider != false) {
			destroy();
		} else if (window.innerWidth < brPoint && slider == false) {
			build();
		}
	}

	var build = function () {
		slider = $(gallery).addClass('owl-carousel');
		slider.owlCarousel({
			slideBy: 1,
			nav: false,
			loop: false,
			dots: true,
			margin: 10,
			responsive: {
				0: {
					items: 1
				},
				768: {
					items: 2
				}
			}
		});
	};

	var destroy = function () {
		slider.trigger('destroy.owl.carousel');
		slider = false;
		$(gallery).removeClass('owl-carousel');
	};

	return {
		init: init
	};

}();

function filterCount() {
	$('#filterForm .form-row').each(function(i, el) {
		var inputsInRow = $(this).find('input');
		var enabled = [];
		inputsInRow.each(function(j, inp) {
			var changed = false;
			if (
				inp.type == 'text' && inp.value.length > 0 ||
				inp.type == 'checkbox' && inp.checked
			) {
				changed = true;
			}
			if(changed && !enabled.includes(i)) {
				$(el).addClass('filtered');
				enabled.push(i);
			} else if(!enabled.includes(i)) {
				$(el).removeClass('filtered');
			}
			$('#filterCount').html($('.form-row.filtered').length);
		});
	});
}

// подсветка строки таблицы, при выделении чекбокса
$('.search-results input').click(function() {
	if(this.type == 'checkbox' && this.checked)
		$(this).closest('tr').addClass('active');
	else
		$(this).closest('tr').removeClass('active');
});
$('#selectAllResults').change(function() {
	if(this.type == 'checkbox' && this.checked) {
		$('.search-results [type="checkbox"]').each(function(i, el) {
			$(el).closest('tr').addClass('active');
			el.checked = true;
		});
	}
	else {
		$('.search-results [type="checkbox"]').each(function(i, el) {
			$(el).closest('tr').removeClass('active');
			el.checked = false;
		});
	}
});

// ховер для подсветки столбцов таблицы
$(".search-results tr td").mouseover(function() {
	var index = $(this).index();
	$(".search-results tr").each(function(i, tr) {
		$(tr).find('td').eq(index).addClass("col-hover");
	});
});
// сброс стилей ховера для таблицы
$(".search-results").mouseout(function() {
	$(".search-results td").removeClass("col-hover");
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

// счетчик оставшихся символов для комментария (страница заявка)
$('#comment').on('input', function() {
	var left = this.maxLength - this.value.length;
	$('#symbolsCounter').html(left);
});


// класс для загрузки сканов и документов (страница заявка)
function app() {
	this.data = {
		filesList: [],
		formData: new FormData(),
		inputName: ''
	}
	this.methods = {
		uploadFiles(e) {
			inputName = e.target.name;
			var files = e.target.files || e.dataTransfer.files;
			if (!files.length)
				return;
			for (var i = files.length - 1; i >= 0; i--) {
				this.filesList.push(files[i]);
			}
		},
		removeFile(file) {
			if(this.filesList.length == 1) {
				this.resetData();
			} else {
				this.filesList.splice(this.filesList.indexOf(file), 1);
			}
		},
		submit(e) {
			var app = this;
			e.preventDefault();
			this.formData = new FormData(); // очищаем во избежание дублирования
			for (const file of this.filesList) {
				this.formData.append(inputName, file);
			}
			$.ajax({
				url: 'server.php',
				type: 'POST',
				success: function (data) {
					alert("Data Uploaded: "+data);
					app.resetData();
				},
				data: this.formData,
				cache: false,
				contentType: false,
				processData: false
			});
		},
		resetData() {
			this.filesList = [];
			this.formData = new FormData();
			this.$el.reset();
		}
	}
};

// коммент бокс открывание
$('#CommentBox .comment-header').click(function() {
	$('#CommentBox').toggleClass('opened');
});
// нажали энтер
$('#CommentTextArea').keydown(function(e) {
	if(e.keyCode === 13) {
		e.preventDefault();
		console.log('enter pressed');
	}
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