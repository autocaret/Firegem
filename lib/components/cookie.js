/*******************************************************************************
The contents of this file are subject to the Mozilla Public License
Version 1.1 (the "License"); you may not use this file except in
compliance with the License. You may obtain a copy of the License at
http://www.mozilla.org/MPL/

Software distributed under the License is distributed on an "AS IS"
basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the
License for the specific language governing rights and limitations
under the License.

This Code is (C) 2023-2024 Aurae Interakctive AS.

Contributor(s): Hogne Titlestad
*******************************************************************************/

function setCookie = function( name, value, expire = 'infinite' )
{
    let expires = "";
    if( expire === 'infinite' )
    {
        const date = new Date();
        date.setTime( date.getTime() + ( 20 * 365 * 24 * 60 * 60 * 1000) ); // 20 years
        expires = "; expires=" + date.toUTCString();
    }
    else if( expire )
    {
        const date = new Date( expire );
        expires = "; expires=" + date.toUTCString();
    }
    
    document.cookie = name + "=" + ( value || "" ) + expires + "; path=/";
}

function getCookie = function( name )
{
    let nameEQ = name + "=";
    let ca = document.cookie.split( ';' );
    for( let i = 0; i < ca.length; i++ )
    {
        let c = ca[ i ];
        while( c.charAt(0) == ' ' )
        	c = c.substring( 1, c.length );
        if( c.indexOf( nameEQ ) == 0 )
        	return c.substring( nameEQ.length, c.length );
    }
    return null;
}

function removeCookie = function( name )
{
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

