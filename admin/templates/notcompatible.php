<?php
/*******************************************************************************
The contents of this file are subject to the Mozilla Public License
Version 1.1 (the "License"); you may not use this file except in
compliance with the License. You may obtain a copy of the License at
http://www.mozilla.org/MPL/

Software distributed under the License is distributed on an "AS IS"
basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the
License for the specific language governing rights and limitations
under the License.

The Original Code is (C) 2004-2010 Blest AS.
New code is (C) 2011 Idéverket AS, 2015 Friend Studios AS

The Initial Developer of the Original Code is Blest AS.
Portions created by Blest AS are Copyright (C) 2004-2010
Blest AS. All Rights Reserved.

Contributor(s): Hogne Titlestad, Thomas Wollburg, Inge Jørgensen, Ola Jensen, 
                Rune Nilssen
*******************************************************************************/

?><?
	if ( !strstr ( $_SERVER[ 'HTTP_USER_AGENT' ], 'MSIE 6' ) )
		return '<' . '?xml version="1.0" encoding="UTF-8"?' . '>';
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
	<head>
		<title>Blest ARENA v2</title>
		<link rel="stylesheet" href="admin/css/login.css" />
		<meta http-equiv="content-type" contents="text/html; charset=utf-8"/>
		<script type="text/javascript" src="lib/javascript/arena-lib.js"></script>
		<script type="text/javascript" src="lib/javascript/bajax.js"></script>
		<script type="text/javascript" src="admin/javascript/login.js"></script>
	</head>
	<body>

    	<div id="UnderContent">
		</div>
		
		<div id="CenterBox">

			<div id="Content">	
				
				<div class="Content">
				
					<h2>
						Non compatible web browser
					</h2>
					<p>
						Your web browser (<?= $_SERVER[ 'HTTP_USER_AGENT' ] ?>) is not supported. Please use one of the
						following web browsers:
					</p>
					<ul>
						<li>
							<a href="https://www.mozilla.org/en-US/firefox/new/" target="_blank">Firefox</a>
						</li>
						<li>
							<a href="https://www.google.com/chrome/" target="_blank">Google Chrome</a>
						</li>
					</ul>
				</div>
				
				<div class="Footer">
					Firegem © 2023-2024 Aurae Interactive
				</div>
				
				
			</div>
				
		</div>
		
		
	</body>
</html>
