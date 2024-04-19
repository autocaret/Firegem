window.extContent = {
	refresh()
	{
		let self = this;
		
		if( !self.domHierarchy )
		{
			let h = document.createElement( 'div' );
			h.className = 'Hierarchy';
			document.querySelector( '.FiregemCanvas' ).appendChild( h );
			self.domHierarchy = h;
		}
		if( !self.domContent )
		{
			let c = document.createElement( 'div' );
			c.className = 'DomContent';
			document.querySelector( '.FiregemCanvas' ).appendChild( c );
			self.domContent = c;
		}
		
		function fixChildren()
		{
		}
		
		console.log( self.pages );
		
		if( self.pages && self.pages.length )
		{
			self.pages.page
			for( let a = 0; a < this.pages.length; a++ )
			{
			}
		}
	},
	load()
	{
		let self = this;
		let m = new XMLHttpRequest();
		m.open( 'POST', 'admin.php?module=extensions&extension=content&action=loadpages', true );
		m.setRequestHeader( 'Content-Type', 'application/json' );
		m.onload = function()
		{
			let resp = JSON.parse( this.responseText );
			if( resp.code == 200 && resp.response )
			{
				self.pages = resp.response;
			}
			self.refresh();
		}
		m.send();
	}
};
extContent.groups = {
	pages: []
};
extContent.load();

