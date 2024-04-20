/**
 * Modal dialogues --------------------------------------------------
**/

let dialogCount = 0;

ModalDialogue = function ( )
{
	// Internal variables
	this._fademode = '';
	this._speed = 500;
	this._phase = 0;
	
	// Setup background
	this.Background = document.createElement( 'div' );
	this.DiaBox = document.createElement( 'div' );
	
	this.Background.style.position = 'fixed';
	this.Background.style.top = '0px';
	this.Background.style.left = '0px';
	this.Background.style.width = '100%';
	this.Background.style.height = '100%';
	this.Background.style.background = '#043355';
	this.Background.style.zIndex = 2001 + ( dialogCount * 2 );
	this.Background.onclick = function(){ return false; };
	this.Background.onmousedown = function(){ return false; };
	this.Background.style.cursor = 'busy';
	
	this.DiaBox.style.position = 'fixed';
	this.DiaBox.style.background = '#eeeeee';
	this.DiaBox.style.zIndex = 2001 + ( dialogCount * 2 );
	this.DiaBox.style.mozBorderRadius = '2px';
	this.DiaBox.style.webkitBorderRadius = '2px';
	
	// Setup foreground
	this.Foreground = document.createElement( 'div' );
	this.Foreground.style.position = 'fixed';

	this.Foreground.style.zIndex = 2002 + ( dialogCount * 2 );
	this.Foreground.className = 'Container ModalContents';
	this.Foreground.style.padding = '2px';
	this.Foreground.style.left = '50%';
	this.Foreground.style.top = '50%';

	this.setWidth = function( varwidth )
	{
		if( varwidth )
		{
			this.Width = Math.round( varwidth );
			this.Foreground.style.width = this.Width + "px";
		}
	}
	
	this.setHeight = function( varheight )
	{
		if( varheight )
		{
			this.Height = Math.round ( varheight );
			this.Foreground.style.height = this.Height + 'px';
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
			
			this.modal._renderBackground();
			this.modal._tm = ( new Date () ).getTime ();
			this.modal._renderForeground();
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
		setOpacity ( this.Background, 0.4 );
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
		setTimeout( () =>
		{
			this.Foreground.classList.add( 'Showing' );
		}, 0 );
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
		
		setTimeout( () =>
		{
			this.refresh();
		}, 0 );
	}
	
	this.refresh = function ( )
	{
		if ( this.Foreground.innerHTML.length > 0 )
			this.Height = getElementHeight ( this.Foreground );
		this.setHeight ( this.Height );
		
		let BgWidth = getElementHeight ( this.Background );
		let BgHeight = getElementWidth ( this.Background );
		let BorderWidth = 12 * this._phase;
		let BorderHeight = 6 * this._phase;
		let dOffX = 3 - ( getVerticalScrollbarWidth ( ) * 0.5 );
		let dOffY = 3;
		let dWidth = Math.round ( this.Width * this._phase );
		let dHeight = Math.round ( this.Height * this._phase );
		this.DiaBox.style.top = ( Math.round ( BgWidth * 0.5 - ( dHeight * 0.5 ) ) - dOffY + ( isIE6 ? getScrollTop ( ) : 0 ) ) + 'px';
		this.DiaBox.style.left = ( Math.round ( BgHeight * 0.5 - ( dWidth * 0.5 ) ) - dOffX ) + 'px';
		this.DiaBox.style.width = ( dWidth + BorderWidth ) + 'px';
		this.DiaBox.style.height = ( dHeight + BorderHeight ) + 'px';
		this.setHeight( this.Foreground.scrollHeight );
	}
}

function removeModalDialogue( varname )
{
	if( !document.modaldialogues )
		return false;
	for( let a = 0; a < document.modaldialogues.length; a++ )
	{
		if( document.modaldialogues[ a ].Name == varname )
		{
			document.modaldialogues[ a ]._removeForeground();
			document.modaldialogues[ a ]._tm = ( new Date () ).getTime();
			setOpacity( document.modaldialogues[ a ].Background, 0 );
			_removeModalDialogue( varname );
			dialogCount--;
			return true;
		}
	}
	return false;
}

function _removeModalDialogue( varname )
{
	let outar = [];
	for( let a = 0; a < document.modaldialogues.length; a++ )
	{
		if( document.modaldialogues[ a ].Name != varname )
		{
			let dex = outar.length;
			outar[ dex ] = document.modaldialogues[ a ];
			outar[ dex ].InstanceName = 'document.modaldialogues[ ' + dex + ' ]';
			outar[ dex ].Index = dex;
		}
		else
		{
			document.modaldialogues[ a ]._removeBackground();
		}
	}
	document.body.style.overflow = 'auto';
	document.modaldialogues = outar;
}

function replaceModalDialogue ( varname, width, height, contenturl, queuefunc )
{
	if( !queuefunc ) queuefunc = 0;
	document.repljax = new bajax();
	document.repljax.openUrl( contenturl, 'get', true );
	document.repljax.queuefunc = queuefunc;
	document.repljax.onload = function ( )
	{
		for( let a = 0; a < document.modaldialogues.length; a++ )
		{
			if( document.modaldialogues[ a ].Name == varname )
			{
				document.modaldialogues[ a ]._removeForeground();
				document.modaldialogues[ a ].setWidth( width );
				document.modaldialogues[ a ].setHeight( height );
				document.modaldialogues[ a ]._content = this.getResponseText();
				document.modaldialogues[ a ]._renderForeground();
				document.modaldialogues[ a ].refresh();
			}
		}	
		if ( this.queuefunc )
			this.queuefunc();
	}
	document.repljax.send();
}

let ModalData = {};
function initModalDialogue( varname, width, height, contenturl, queuefunc )
{
	if ( !queuefunc ) queuefunc = false;
	removeModalDialogue ( varname );
	if ( !document.modaldialogues )
		document.modaldialogues = [];
	
	let dex = document.modaldialogues.length;
	document.modaldialogues[ dex ] = new ModalDialogue();
	document.modaldialogues[ dex ].setWidth( width );
	document.modaldialogues[ dex ].setHeight( height );
	document.modaldialogues[ dex ].contenturl = contenturl;
	document.modaldialogues[ dex ].Index = dex;
	document.modaldialogues[ dex ].Name = varname;
	document.modaldialogues[ dex ].InstanceName = "document.modaldialogues[" + dex + "]";
	document.modaldialogues[ dex ].queuefunc = queuefunc;
	document.modaldialogues[ dex ].init ();
	
	return document.modaldialogues[ dex ];
}

function resizeModalDialogue( name, width, height )
{
	if( name && ( width || height ) )
	{
		for( let a = 0; a < document.modaldialogues.length; a++ )
		{
			let m = document.modaldialogues[ a ];
			if( m.Name == name )
			{
				if( width )
					m.setWidth( width );
				if( height )
					m.setHeight( height );
				m.refresh();
				break;
			}
		}
	}
}
