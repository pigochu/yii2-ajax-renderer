<?php
namespace pigolab\ajaxrenderer;
use Yii;

class AjaxRenderer extends \yii\base\Widget
{
    /**
     * @inheritdoc
     */
    public function init()
    {
        if(Yii::$app->getRequest()->isAjax) {
            ob_start();
            ob_implicit_flush(false);
            $view = $this->getView();
            $view->clear();
            $view->beginPage();
            $view->head();
            $view->beginBody();
        } 
    }

    /**
     * @inheritdoc
     */
    public function run()
    {
        if (!Yii::$app->getRequest()->isAjax) {
            return;
        }
        $view = $this->getView();
        $view->endBody();
        $view->endPage(true);
        $content = ob_get_clean();
        $response = Yii::$app->getResponse();
        $response->clearOutputBuffers();
        $response->setStatusCode(200);
        $response->format = \yii\web\Response::FORMAT_HTML;
        $response->content = $content;
        $response->send();

        Yii::$app->end();
    }
}
