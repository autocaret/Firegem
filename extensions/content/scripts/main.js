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
			
			let c = document.createElement( 'canvas' );
			c.className = 'HierarchyCanvas';
			document.querySelector( '.FiregemCanvas' ).appendChild( c );
			self.domHierarchyCanvas = c;
		}
		
		const cnv = self.domHierarchyCanvas;
		cnv.setAttribute( 'width', cnv.parentNode.offsetWidth );
		cnv.setAttribute( 'height', cnv.parentNode.offsetHeight );
		
		if( !self.domContent )
		{
			let c = document.createElement( 'div' );
			c.className = 'DomContent';
			document.querySelector( '.FiregemCanvas' ).appendChild( c );
			self.domContent = c;
		}
		
		let ctx = cnv.getContext( '2d' );
		
		function fixOrphans( p )
		{
			
		}
		
		function drawLevel( level )
		{
			if( !level.dom )
			{
				level.dom = document.createElement( 'div' );
				level.dom.className = 'LevelPage';
				if( !level.parent ) level.parent = self.domHierarchy;
				level.dom.innerHTML = '<div class="LevelNameBlock">' + level.page.MenuTitle + '</div>';
				
				level.dom.subs = document.createElement( 'div' );
				level.dom.subs.className = 'LevelChildren';
				level.dom.appendChild( level.dom.subs );
				level.parent.appendChild( level.dom );
			}
			for( let a = 0; a < level.children.length; a++ )
			{
				level.children[ a ].parent = level.dom.subs;
				drawLevel( level.children[ a ] );
			}
		}
		
		function drawConnectors( level )
		{
			let offset = self.domHierarchyCanvas.getBoundingClientRect();
		
			let from = level.dom.querySelector( '.LevelNameBlock' );
			
			for( let a = 0; a < level.children.length; a++ )
			{
				let to = level.children[ a ].dom.querySelector( '.LevelNameBlock' );
				
				let fromR = from.getBoundingClientRect();
				let toR = to.getBoundingClientRect();
				
				let fromMidX = fromR.left + ( from.offsetWidth >> 1 );
				let toMidX = toR.left + ( to.offsetWidth >> 1 );
				
				let points = [
					{ x: fromMidX, y: fromR.top + from.offsetHeight },
					{ x: fromMidX, y: fromR.top + from.offsetHeight + ( ( toR.top - ( fromR.top + from.offsetHeight ) >> 1 ) ) },
					{ x: toMidX,   y: fromR.top + from.offsetHeight + ( ( toR.top - ( fromR.top + from.offsetHeight ) >> 1 ) ) },
					{ x: toMidX,   y: toR.top }
				];
				
				for( let z = 0; z < points.length; z++ )
				{
					points[z].x -= offset.left;
					points[z].y -= offset.top;
				}
				
				// Zig Zag line
				ctx.strokeStyle = 'white';
				ctx.strokeWidth = '1px';
				ctx.beginPath();
				ctx.moveTo( points[0].x, points[0].y );
				ctx.lineTo( points[1].x, points[1].y );
				//ctx.quadraticCurveTo( points[ 1 ].x, points[ 1 ].y, ( points[ 1 ].x + points[ 2 ].x ) / 2, ( points[ 1 ].y + points[ 2 ].y ) / 2 );
				//ctx.quadraticCurveTo( points[ 2 ].x, points[ 2 ].y, ( points[ 2 ].x + points[ 3 ].x ) / 2, ( points[ 2 ].y + points[ 3 ].y ) / 2 );
				ctx.lineTo( points[2].x, points[2].y );
				ctx.lineTo( points[3].x, points[3].y );
				ctx.stroke();

				drawConnectors( level.children[ a ] );
			}
		}
		
		drawLevel( self.pages );
		drawConnectors( self.pages );
		
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
window.addEventListener( 'resize', function(){ window.extContent.refresh() } );
