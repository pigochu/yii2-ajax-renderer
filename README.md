Yii2 Ajax Renderer
==================

This widget was originally developed idea is that, sometimes we need dynamic add new ROW to table , but it's hard to develop in frontend, more simple way is produced by the backend, and keep only need to dynamically add content to the frontend.

Install :
---------

~~~
composer require pigochu/yii2-ajax-renderer:"dev-master"
~~~

Usage :
-------

### View  ###

~~~
<?php
use pigolab/ajaxrenderer/AjaxRenderer;
?>
<table id="tbl">
  <tbody>
    <?php for($i=0; $i<3; $i++): ?>
    <tr>
      <td><?php echo $i; ?> never display in AJAX mode</td>
    </tr>
    <?php endfor; ?>
    <?php AjaxRenderer::begin(); ?>
    <tr>
      <td>display in normal mode and AJAX mode</td>
    </tr>
    <?php AjaxRenderer::end(); ?>
  </tbody>
</table>
~~~

If we use normal call , result is :

~~~
<table id="tbl">
  <tbody>
    <tr>
      <td>0 never display in AJAX mode</td>
      <td>1 never display in AJAX mode</td>
      <td>2 never display in AJAX mode</td>
    </tr>
    <tr>
      <td>display in normal mode and AJAX mode</td>
    </tr>
  </tbody>
</table>
~~~

If use AJAX call , result is :

~~~
    <tr>
      <td>display in normal mode and AJAX mode</td>
    </tr>
~~~



### call $.renderAjax() ###

client has provided $.renderAjax() can handle ajax content, it will filter script or css put into the head tag, let's DOM will not mess.

This sample will load url , and append content to $('#tbl tbody')

~~~
<?php
    // If your view not use AjaxRenderer::begin() ，you need call AjaxRendererAsset::regiter()
    // use pigolab/ajaxrenderer/AjaxRendererAsset;
    // AjaxRendererAsset::register($this);
?>
<script>
$('#yourButtonId').on('click' , function(){
	$.renderAjax({
	    url : "<?= Url::to('Your Route') ?>",
	    renderMode : 'append',
	    targetElement : $('#tbl tbody')
	});
});
</script>
~~~



$.renderAjax Usage :
-------------------

Basic Syntax:  $.renderAjax(options)。 

$.renderAjax() need three options :

~~~
$.renderAjax({
    url : "<?= Url::to('Your Route') ?>",
    renderMode : 'append',
    targetElement : $('#tbl tbody')
});
~~~


- url : The url you want to load.
- renderMode : Render Mode can be 'replace', 'append', and 'prepend' , default is 'replace'
- targetElement : The element you want to replace/append/prepend content.


You can also put $.ajax defined options :
~~~
$.renderAjax({
    url : "<?= Url::to('Your Route') ?>",
    renderMode : 'append',
    targetElement : $('#tbl tbody'),
    method: 'POST',
    error: function( jqXHR, textStatus, errorThrown ) { // .... }
});
~~~

$.renderAjax() defined two additional events :  beforeRender and  afterRender 

~~~
$.renderAjax({
    url : "<?= Url::to('Your Route') ?>",
    renderMode : 'append',
    targetElement : $('#tbl tbody'),
    beforeRender : function(data , options , originData) { // if ajax call success，than trigger this event },
    afterRender : function(data , options , originData) { // if ajax call success, and render success , than trigger this event  },
});
~~~

beforeRender & afterRender callback options
- data : This is an array , renderAjax parse response data than convert to [contents,scripts,links] , you can modify it at beforeRender or init some plugin at afterRender. 
- options : This is $.renderAjax(options) passed to the callback
- originData : Origin response data

