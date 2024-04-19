<?php

require_once( 'lib/classes/dbObjects/dbContent.php' );

$response = ( object )[ 'response' => '', 'code' => 0 ];

$c = dbContent::getRootContent();

function contentToPage( $c )
{
	$o = new stdClass();

	$fields = [
		'ID', 'MainID', 'Parent', 'SymLink', 'SortOrder', 'Title', 'MenuTitle',
		'SystemName', 'Intro', 'Body', 'IsPublished', 'IsFallback', 'IsSystem', 'IsMain',
		'IsDeleted', 'DateCreated', 'DateModified', 'DatePublish', 'DateArchive', 'Link',
		'LinkData', 'Template', 'TemplateArchived', 'TemplateID', 'Author', 'Version',
		'VersionPublished', 'Language', 'ContentType', 'RouteName', 'IsTemplate', 
		'IsProtected', 'IsDefault', 'SeenTimesUnique', 'SeenTimes', 'ContentGroups',
		'ContentTemplateID'
	];
	foreach( $fields as $f )
		$o->{$f} = $c->{$f};
	return $o;
}

function loadSubs( $d, &$pages )
{
	$c = new dbContent();
	$c->addClause( 'WHERE', '`Parent`=\'' . $d->MainID . '\' AND `MainID`!=`ID`' );
	$c->addClause( 'ORDER BY', '`SortOrder` ASC, ID ASC' );

	if( $subs = $c->find() )
	{
		foreach( $subs as $sub )
		{
			$o = ( object )[ 'page' => contentToPage( $sub ), 'children' => [] ];
			loadSubs( $sub, $o->children );
			$pages[] = $o;
		}
	}
}

$pages = ( object )[ 'page' => contentToPage( $c ), 'children' => [] ];
loadSubs( $pages->page, $pages->children );

$response->code = 200;
$response->response = $pages;

die( json_encode( $response ) );

?>
