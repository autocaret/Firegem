<?php

if( !function_exists( 'mysql_error' ) )
{
	function mysql_error( $l = false )
	{
	    if( !$l ) return false;
		return mysqli_error( $l );
	}
}

?>
