<?php

global $Session;

$Session->Set( 'CurrentPage', $_REQUEST[ 'page' ] );

include( 'loadpages.php' );

?>
