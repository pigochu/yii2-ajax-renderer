<?php
namespace pigolab\ajaxrenderer;

use yii\web\AssetBundle;


class AjaxRendererAsset extends AssetBundle
{
    public $sourcePath = '@vendor/pigochu/yii2-ajax-renderer/assets';
    public $js = [
        'render-ajax.js',
    ];
    public $depends = [
        'yii\web\JqueryAsset',
    ];
}