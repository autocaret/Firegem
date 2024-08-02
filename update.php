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
    goto g_database_check;
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

g_database_check:

if( $b = $corebase->fetchObjectRows( 'DESCRIBE `Users`' ) )
{
    $spec = ( object )[
        'ID' => 0,
        'Username' => 0,
        'Password' => 0,
        'Name' => 0,
        'DateCreated' => 0,
        'DateModified' => 0,
        'DateLogin' => 0,
        'Email' => 0,
        'InGroups' => 0
    ];

    foreach( $b as $field )
    {
        if( $spec->{$field->Field} == 0 ) 
        {
            $spec->{$field->Field} = 1;
        }
    }
    
    // Add date
    if( $spec->DateCreated == 0 )
    {
        $corebase->query( 'ALTER TABLE `Users` ADD `DateCreated` datetime AFTER `Name`' );
    }
    if( $spec->DateModified == 0 )
    {
        $corebase->query( 'ALTER TABLE `Users` ADD `DateModified` datetime AFTER `Name`' );
    }
    if( $spec->DateLogin == 0 )
    {
        $corebase->query( 'ALTER TABLE `Users` ADD `DateLogin` datetime AFTER `Name`' );
    }
    
    // Add date
    if( $spec->InGroups == 0 )
    {
        $corebase->query( 'ALTER TABLE `Users` ADD `InGroups` tinyint(4) default 0 AFTER `Email`' );
    }
}

die( 'All done.' . "\n" );

?>
