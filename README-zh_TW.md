Yii2 Ajax Renderer
==================

這個元件原本開發構想是這樣的，有時候會需要做 table 內動態新增 ROW , 包含各種 InputWidget，但如果靠前端產生比較複雜，比較簡單的方式是由後端產生，並且只保留需要動態新增的內容給前端。

安裝方式
-------

~~~
composer require pigochu/yii2-ajax-renderer:"dev-master"
~~~

使用方法
-------

### View 內容 ###

~~~
<?php
use pigolab/ajaxrenderer/AjaxRenderer;
?>
<table id="tbl">
  <tbody>
    <?php for($i=0; $i<3; $i++): ?>
    <tr>
      <td><?php echo $i; ?> 這塊如果是以 Ajax 呼叫則不會顯示</td>
    </tr>
    <?php endfor; ?>
    <?php AjaxRenderer::begin(); ?>
    <tr>
      <td>這塊不論是不是以 Ajax 呼叫都會顯示</td>
    </tr>
    <?php AjaxRenderer::end(); ?>
  </tbody>
</table>
~~~

如果是以一般方式調用 Url ，輸出內容如下
~~~
<table id="tbl">
  <tbody>
    <tr>
      <td>0 這塊如果是以 Ajax 呼叫則不會顯示</td>
      <td>1 這塊如果是以 Ajax 呼叫則不會顯示</td>
      <td>2 這塊如果是以 Ajax 呼叫則不會顯示</td>
    </tr>
    <tr>
      <td>這塊不論是不是以 Ajax 呼叫都會顯示</td>
    </tr>
  </tbody>
</table>
~~~

如果是以 Ajax 方式調用，輸出內容入下

~~~
    <tr>
      <td>這塊不論是不是以 Ajax 呼叫都會顯示</td>
    </tr>
~~~



### 調用 renderAjax ###

client 端有提供 $.renderAjax() 可以處理內容的置換或新增，並且會篩選 script 或 css 放至 head 標籤內 ，讓我們的 DOM 不至於亂掉

例如以下這段，會調用 url 內容，並且用新增的方式將內容加到 $('#tbl tbody') 最後面

~~~
<?php
    // 如果你的主要頁面並沒有 AjaxRenderer::begin() 被呼叫過，則必須引入 AjaxRendererAsset
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



前端 renderAjax 解釋
-------------------

基本用法是 $.renderAjax(options)。 

$.renderAjax() 最少需要以下三個參數才能運作 :

~~~
$.renderAjax({
    url : "<?= Url::to('Your Route') ?>",
    renderMode : 'append',
    targetElement : $('#tbl tbody')
});
~~~


- url : 就是 ajax 要呼叫的 Url
- renderMode : 繪製方式，可以有 replace(取代) , append(加到最後) , prepend(加到最前) , replace 是預設的
- targetElement : ajax 取得的內容要繪製到那個 element


當然我們也能將原本 $.ajax 所定義的的參數或事件給它 :
~~~
$.renderAjax({
    url : "<?= Url::to('Your Route') ?>",
    renderMode : 'append',
    targetElement : $('#tbl tbody'),
    method: 'POST',
    error: function( jqXHR, textStatus, errorThrown ) { // .... }
});
~~~

renderAjax 另外定義了 beforeRender 及 afterRender 兩個事件

~~~
$.renderAjax({
    url : "<?= Url::to('Your Route') ?>",
    renderMode : 'append',
    targetElement : $('#tbl tbody'),
    beforeRender : function(data , options , originData) { // 如果 ajax 呼叫成功，要 render 之前會觸發此事件 },
    afterRender : function(data , options , originData) { // 如果 ajax 呼叫成功, 在 render 之後會觸發此事件  },
});
~~~

beforeRender & afterRender callback 傳遞參數解釋
- data : 這是一個陣列 , renderAjax 頗析完返回的資料會轉成 [contents,scripts,links] ,你可以在 beforeRender 中改變其值將會影響 render 結果，或於 afterRender 中對 render 後的元素初始化一些插件 . 
- options : This is $.renderAjax(options) passed to the callback
- originData : Origin response data

