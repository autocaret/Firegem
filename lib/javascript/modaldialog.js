/**
 * Modal dialogues --------------------------------------------------
**/

var dialogCount = 0;
var ModalDialogue = function ( )
{
	// Internal variables
	this._fademode = '';
	this._speed = 500;
	this._phase = 0;
	
	// Setup background
	this.Background = document.createElement ( "DIV" );
	this.DiaBox = document.createElement ( "DIV" );
	
	this.Background.style.position = 'fixed';
	this.Background.style.top = '0px';
	this.Background.style.left = '0px';
	this.Background.style.width = '100%';
	this.Background.style.height = isIE6 ? ( getDocumentHeight ( ) + 'px' ) : '100%';
	this.Background.style.background = '#043355';
	this.Background.style.zIndex = 2001 + ( dialogCount * 2 );
	this.Background.onclick = function () { return false; };
	this.Background.onmousedown = function () { return false; };
	this.Background.style.cursor = 'busy';
	
	this.DiaBox.style.position = 'fixed';
	this.DiaBox.style.background = '#eeeeee';
	this.DiaBox.style.zIndex = 2001 + ( dialogCount * 2 );
	this.DiaBox.style.mozBorderRadius = '2px';
	this.DiaBox.style.webkitBorderRadius = '2px';
	
	// Setup foreground
	this.Foreground = document.createElement ( "DIV" );
	this.Foreground.style.position = 'fixed';

	this.Foreground.style.zIndex = 2002 + ( dialogCount * 2 );
	this.Foreground.className = 'Container ModalContents';
	this.Foreground.style.padding = '2px';

	this.setWidth = function ( varwidth )
	{
		if ( varwidth )
		{
			this.Foreground.style.width = Math.round ( varwidth ) + "px";
			this.Foreground.style.left = Math.round ( ( getDocumentWidth ( ) / 2 ) - ( Math.round ( varwidth ) / 2 ) ) + "px";
			this.Width = Math.round ( varwidth );
		}
	}
	
	this.setHeight = function ( varheight )
	{
		if ( varheight )
		{
			if ( isIE6 )
			{
				var t = this;
				addEvent ( 'onscroll', function ( )
				{
					t.Foreground.style.height = Math.round ( varheight ) + "px";
					var top = Math.round ( ( getDocumentHeight ( ) / 2 ) - ( Math.round ( varheight ) / 2 ) );
					var bgTop = 0;
					if( getScrollTop() > 0 )
					{
						top += getScrollTop();
						bgTop = getScrollTop();
					}
					t.Foreground.style.top = top + 'px'; 
					t.Background.style.top = bgTop + 'px'; 
				} );
				document.onscroll();
			}
			else
			{
				var top = Math.round ( ( getDocumentHeight ( ) / 2 ) - ( Math.round ( varheight ) / 2 ) );
				this.Foreground.style.top = top + 'px';
			}
			this.Height = Math.round ( varheight );
		}
	}

	this.init = function ( )
	{
		this._container = document.createElement ( 'div' );
		document.body.insertBefore ( this._container, document.body.firstChild  );
		
		if ( !this.contenturl ) removeModalDialogue ( this.Name );
		this.jax = new bajax ( );
		this.jax.modal = this;
		this.jax.openUrl ( this.contenturl, 'get', true );
		this.jax.onload = function ( )
		{
			this.modal._content = this.getResponseText ( );
			
			// Lost session? To main page!
			if ( this.modal._content.indexOf ( 'loginUsername' ) >= 0 )
			{
				var bref = document.getElementsByTagName ( 'base' )[0].href;
				if ( document.getElementById ( 'MetaButtons' ) )
					bref += 'admin.php';
				removeModalDialogue ( this.Name );
				document.location = bref;
				return false;
			}
			
			// Extract scripts
			this.modal._scripts = extractScripts ( this.modal._content );
			
			this.modal._renderBackground ( );
			this.modal._tm = ( new Date () ).getTime ();
			if ( this.modal.queuefunc )
			{	
				this.modal._fadein ( 
					new Array ( 
						this.modal.InstanceName + '._renderForeground ( )', 
						this.modal.InstanceName + '.queuefunc ( )' 
					) 
				);
			}
			else
			{
				this.modal._fadein ( this.modal.InstanceName + '._renderForeground ( )' );
			}
			dialogCount++;
		}
		this.jax.send ( );
	}
	
	this._removeBackground = function ( )
	{
		if ( this._container && this.Background )
			this._container.removeChild ( this.Background ); 
	}
	
	this._removeForeground = function ( )
	{
		if ( ge ( 'ModalForeground' ).intr )
		{
			clearInterval ( ge ( 'ModalForeground' ).intr );
		}
		this._container.removeChild ( this.Foreground );
	}
	
	this._renderBackground = function ( )
	{
		this._container.appendChild ( this.Background );
		setOpacity ( this.Background, 0 );
		this._container.appendChild ( this.DiaBox );
	}
	this._renderForeground = function ( )
	{
		this.Foreground.obj = this;
		this.Foreground.onmousedown = function ()
		{
			document._tempForeground = this.obj;
			setTimeout ( 'try { document._tempForeground.refresh(); document._tempForeground = false; } catch(e){};', 250 );
		}
		this.Foreground.innerHTML = '<div id="ModalForeground" class="SubContainer" style="display: block; overflow: auto;">' + this._content + '</div>';
		this._container.appendChild ( this.Foreground );
		
		// If we have scripts queued to be executed, execute!!
		if ( this._scripts )
		{
			for ( var a = 0; a < this._scripts.length; a++ )
			{
				if ( this._scripts[ a ] )
				{
					try
					{
						eval.call ( window, this._scripts[ a ] );
					}
					catch ( e ){ window.execScript ( this._scripts[ a ] ); };
				}
			}
		}
		this.refresh ();
		document.getElementById ( 'ModalForeground' ).modal = this;
		document.getElementById ( 'ModalForeground' ).intr = 
			setInterval ( "try { document.getElementById ( 'ModalForeground' ).modal.refresh(); } catch (e){};", 250 );
	}
	
	this._fadein = function ( varfunc )
	{
		if ( !varfunc ) varfunc = '';
		if ( this._fademode != '' && this._fademode != 'in' )
			return;
		this._fademode = 'in';
		
		var diff = ( ( new Date () ).getTime () - this._tm ) / this._speed;
		this._phase = diff > 1 ? 1 : Math.sin ( diff * 0.5 * Math.PI );
		var timeout = '';
		
		if ( this._phase < 1 )
		{
			this.Background.style.cursor = 'busy';
			this.DiaBox.style.cursor = 'busy';
			timeout = this.InstanceName + "._fadein ( '" + varfunc + "' )";
		}
		else 
		{
			this.Background.style.cursor = 'default';
			this.DiaBox.style.cursor = 'default';
			this._fademode = '';
			if ( varfunc )
			{
				if ( typeof ( varfunc ) == "array" )
				{
					for ( var z = 0; z < varfunc.length; z++ )
						timeout = varfunc[ z ];
				}
				else timeout = varfunc;
			}
		}
		if ( this._phase == 1 )
		{
			setOpacity ( this.Background, 0.6 );
			this.DiaBox.className = 'DialogueBox';
		}
		else setOpacity ( this.Background, this._phase * 0.6 );
		this.refresh ();
		if ( timeout.length )
			setTimeout ( timeout, timeout.indexOf ( 'fadein' ) >= 0 ? 5 : 5 );
	}
	
	this.refresh = function ( )
	{
		if ( this.Foreground.innerHTML.length > 0 )
			this.Height = getElementHeight ( this.Foreground );
		this.setHeight ( this.Height );
		
		var BgWidth = getElementHeight ( this.Background );
		var BgHeight = getElementWidth ( this.Background );
		var BorderWidth = 12 * this._phase;
		var BorderHeight = 6 * this._phase;
		var dOffX = 3 - ( getVerticalScrollbarWidth ( ) * 0.5 );
		var dOffY = 3;
		var dWidth = Math.round ( this.Width * this._phase );
		var dHeight = Math.round ( this.Height * this._phase );
		
		this.DiaBox.style.top = ( Math.round ( BgWidth * 0.5 - ( dHeight * 0.5 ) ) - dOffY + ( isIE6 ? getScrollTop ( ) : 0 ) ) + 'px';
		this.DiaBox.style.left = ( Math.round ( BgHeight * 0.5 - ( dWidth * 0.5 ) ) - dOffX ) + 'px';
		this.DiaBox.style.width = ( dWidth+BorderWidth ) + 'px';
		this.DiaBox.style.height = ( dHeight+BorderHeight ) + 'px';
	}
	
	this._fadeout = function ( varfunc )
	{
		if ( !varfunc ) varfunc = '';
		if ( this._fademode != '' && this._fademode != 'out' )
			return;
		this._fademode = 'out';
		var diff = ( ( new Date () ).getTime () - this._tm ) / this._speed;
		this._phase = 1 - ( diff > 1 ? 1 : Math.pow ( diff, 3 ) );
		var timeout = '';
		
		if ( this._phase > 0 )	
		{
			this.refresh ();
			this.Background.style.cursor = 'busy';
			timeout = this.InstanceName + "._fadeout ( \"" + varfunc + "\" )";
		}
		else 
		{
			this.DiaBox.style.display = 'none';
			this._fademode = '';
			if ( varfunc ) timeout = varfunc;
		}
		
		if ( timeout.length )
			setTimeout ( timeout, timeout.indexOf ( 'fadeout' ) >= 0 ? 5 : 5 );
	}
}

function removeModalDialogue ( varname )
{
	if ( !document.modaldialogues )
		return false;
	for ( var a = 0; a < document.modaldialogues.length; a++ )
	{
		if ( document.modaldialogues[ a ].Name == varname )
		{
			document.modaldialogues[ a ]._removeForeground ( );
			document.modaldialogues[ a ]._tm = ( new Date () ).getTime ();
			document.modaldialogues[ a ]._fadeout ( "_removeModalDialogue ( '" + varname + "' )" );
			setOpacity ( document.modaldialogues[ a ].Background, 0 );
			dialogCount--;
			return true;
		}
	}
	return false;
}

function _removeModalDialogue ( varname )
{
	var outar = new Array ( );
	for ( var a = 0; a < document.modaldialogues.length; a++ )
	{
		if ( document.modaldialogues[ a ].Name != varname )
		{
			var dex = outar.length;
			outar[ dex ] = document.modaldialogues[ a ];
			outar[ dex ].InstanceName = 'document.modaldialogues[ ' + dex + ' ]';
			outar[ dex ].Index = dex;
		}
		else
		{
			document.modaldialogues[ a ]._removeBackground ( );
		}
	}
	document.body.style.overflow = 'auto';
	document.modaldialogues = outar;
}

function replaceModalDialogue ( varname, width, height, contenturl, queuefunc )
{
	if ( !queuefunc ) queuefunc = 0;
	document.repljax = new bajax ( );
	document.repljax.openUrl ( contenturl, 'get', true );
	document.repljax.queuefunc = queuefunc;
	document.repljax.onload = function ( )
	{
		for ( var a = 0; a < document.modaldialogues.length; a++ )
		{
			if ( document.modaldialogues[ a ].Name == varname )
			{
				document.modaldialogues[ a ]._removeForeground ( );
				document.modaldialogues[ a ].setWidth ( width );
				document.modaldialogues[ a ].setHeight ( height );
				document.modaldialogues[ a ]._content = this.getResponseText ( );
				document.modaldialogues[ a ]._renderForeground ( );
				document.modaldialogues[ a ].refresh ();
			}
		}	
		if ( this.queuefunc )
			this.queuefunc ( );
	}
	document.repljax.send ( );
}

var ModalData = new Object ( );
function initModalDialogue ( varname, width, height, contenturl, queuefunc )
{
	if ( !queuefunc ) queuefunc = false;
	removeModalDialogue ( varname );
	if ( !document.modaldialogues )
		document.modaldialogues = new Array ( );
	
	var dex = document.modaldialogues.length;
	document.modaldialogues[ dex ] = new ModalDialogue ( );
	document.modaldialogues[ dex ].setWidth ( width );
	document.modaldialogues[ dex ].setHeight ( height );
	document.modaldialogues[ dex ].contenturl = contenturl;
	document.modaldialogues[ dex ].Index = dex;
	document.modaldialogues[ dex ].Name = varname;
	document.modaldialogues[ dex ].InstanceName = "document.modaldialogues[ " + dex + " ]";
	document.modaldialogues[ dex ].queuefunc = queuefunc;
	document.modaldialogues[ dex ].init ();
	
	return document.modaldialogues[ dex ];
}

function resizeModalDialogue ( name, width, height )
{
	if ( name && ( width || height ) )
	{
		for ( var a = 0; a < document.modaldialogues.length; a++ )
		{
			var m = document.modaldialogues[ a ];
			if ( m.Name == name )
			{
				if ( width )
					m.setWidth ( width );
				if ( height )
					m.setHeight ( height );
				m.refresh ();
				break;
			}
		}
	}
}
