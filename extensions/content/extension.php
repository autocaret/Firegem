<?php

global $document;

$document->addHeadScript( 'extensions/content/scripts/class.page.js' );
$document->addHeadScript( 'extensions/content/scripts/main.js' );
$document->addResource( 'stylesheet', 'extensions/content/css/extension.css' );

if( isset( $_REQUEST[ 'action' ] ) )
{
	if( $_REQUEST[ 'action' ][0] != '.' )
	{
		$action = __DIR__ . '/actions/' . $_REQUEST[ 'action' ] . '.php';
		if( file_exists( $action ) )
		{
			require( $action );
		}
	}
}

$etpl = new cPTemplate( __DIR__ . '/templates/extension.php' );
$extension .= $etpl->render();

?>
