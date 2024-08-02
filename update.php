#!/usr/bin/php
<?php
require_once( 'lib/classes/database/cdatabase.php' );
require_once( 'lib/classes/dbObjects/dbObject.php' );
$corebase = new cDatabase();
include_once( 'lib/lib.php' );
require_once( '/usr/local/firegem/lib/core_config.php' ); // Todo, do not assume location
$corebase->Open();
dbObject::globalValueSet ( 'corebase', $corebase );

// Check which version we're at
g_test:
if( !$corebase->fetchObjectRow( 'DESCRIBE `FiregemInfo`' ) ) // Create
{
    $corebase->query( 'CREATE TABLE `FiregemInfo` ( ID bigint(20) NOT NULL auto_increment PRIMARY KEY, `Version` double, `Date` datetime )' );
    goto g_test;
}

g_version:
if( $row = $corebase->fetchObjectRow( 'SELECT * FROM `FiregemInfo` ORDER BY `Version` DESC LIMIT 1' ) )
{
    echo $row->Version . ', ' . $row->Date . "\n";
}
// No version, assume pre 2.5.0
else
{
    $o = new dbObject( 'FiregemInfo', $corebase );
    $o->Version = '2.5.0';
    $o->Date = date( 'Y-m-d H:i:s' );
    $o->Save();
    goto g_version;
}
die( 'All done.' . "\n" );


?>
