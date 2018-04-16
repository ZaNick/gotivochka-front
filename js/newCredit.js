$('[data-toggle="tooltip"]').tooltip();


function nextTab() {
	console.log($('[data-toggle="tab"].active').parent().next().find('a').tab('show'));
}
function prevTab() {
	console.log($('[data-toggle="tab"].active').parent().prev().find('a').tab('show'));
}