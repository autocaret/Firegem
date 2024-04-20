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
				
				if( level.type == 'add' )
				{
					level.dom.innerHTML = '<div class="LevelNameBlock AddPage">+</div>';
				}
				else
				{
					if( !level.parent ) level.parent = self.domHierarchy;
					let cr = '';
					if( level.current )
						cr = ' Current';
					level.dom.innerHTML = '<div class="LevelNameBlock' + cr + '">' + level.page.MenuTitle + '</div>';
				}
				level.dom.querySelector( '.LevelNameBlock' ).addEventListener( 'click', () => {
					extContent.setCurrentLevel( level.page.MainID );
				} );
				
				level.dom.subs = document.createElement( 'div' );
				level.dom.subs.className = 'LevelChildren';
				level.dom.appendChild( level.dom.subs );
				level.parent.appendChild( level.dom );
				
				// Move dom content
				if( self.domHierarchy.offsetHeight < self.domHierarchy.scrollHeight )
				{
					self.domHierarchy.style.height = self.domHierarchy.scrollHeight + 'px';
				}
				self.domContent.style.height = 'calc(100% - ' + self.domHierarchy.scrollHeight + 'px)';
				self.domContent.style.top = self.domHierarchy.scrollHeight + 'px';
			}
			if( level.current )
			{
				level.dom.querySelector( '.LevelNameBlock' ).classList.add( 'Current' );
			}
			else
			{
				level.dom.querySelector( '.LevelNameBlock' ).classList.remove( 'Current' );
			}
			if( !level.childAdd )
			{
				level.childAdd = {
					type: 'add',
					page: { MenuTitle: 'Add' },
					children: false
				};
				if( level.children )
				{
					level.children.push( level.childAdd );
				}
			}
			if( level.children )
			{
				for( let a = 0; a < level.children.length; a++ )
				{
					level.children[ a ].parent = level.dom.subs;
					drawLevel( level.children[ a ] );
				}
			}
		}
		
		function clearConnectors()
		{
			ctx.clearRect( 0, 0, self.domHierarchyCanvas.offsetWidth, self.domHierarchyCanvas.offsetHeight );
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
				if( Math.abs( toMidX - fromMidX ) <= 1 )
				{
					toMidX = fromMidX;
				}
				
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
				ctx.lineTo( points[2].x, points[2].y );
				ctx.lineTo( points[3].x, points[3].y );
				ctx.stroke();

				drawConnectors( level.children[ a ] );
			}
		}
		
		drawLevel( self.pages );
		clearConnectors();
		drawConnectors( self.pages );
		setTimeout( function()
		{
			clearConnectors();
			drawConnectors( self.pages );
		}, 100 );
		
	},
	setCurrentLevel( lid )
	{
		let self = this;
		let m = new XMLHttpRequest();
		m.open( 'POST', 'admin.php?module=extensions&extension=content&action=setpage&page=' + lid, true );
		m.setRequestHeader( 'Content-Type', 'application/json' );
		m.onload = function()
		{
			let resp = JSON.parse( this.responseText );
			if( resp.code == 200 && resp.response )
			{
				self.updatePages( resp.response );
			}
			self.refresh();
		}
		m.send();
	},
	updatePages( newPages )
	{
		let self = this;
		
		console.log( newPages );
		
		function setLevel( old, incoming = false )
		{
			if( !incoming )
			{
				return;
			}
			
			old.current = incoming.current;
			old.childAdd = incoming.childAdd;
			
			let tmp = old.children;
			if( !tmp ) return;
			old.children = incoming.children;
			for( let a = 0; a < tmp.length; a++ )
			{
				let found = false;
				for( let b = 0; b < old.children.length; b++ )
				{
					if( tmp[ a ].page.MainID == old.children[ b ].page.MainID )
					{
						found = true;
						old.children[ b ].dom = tmp[ a ].dom;
						// Recurse
						setLevel( tmp[ a ], old.children[ b ] );
						break;
					}
				}
				// Remove obsolete one
				if( !found )
				{
					if( tmp[ a ].dom )
						tmp[ a ].dom.parentNode.removeChild( tmp[ a ].dom );
				}
			}
		}
		
		if( !self.pages )
		{
			self.pages = newPages;
			return;
		}
		setLevel( self.pages, newPages );
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
				self.updatePages( resp.response );
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
