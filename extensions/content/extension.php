<?php

global $document;

$document->addResource( 'stylesheet', 'extensions/content/css/extension.css' );

$etpl = new cPTemplate( __DIR__ . '/templates/extension.php' );
$extension .= $etpl->render();

?>
