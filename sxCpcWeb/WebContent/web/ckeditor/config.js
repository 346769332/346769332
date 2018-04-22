 

CKEDITOR.editorConfig = function( config ) {
  
	config.toolbarGroups = [
	                		{ name: 'clipboard', groups: [ 'clipboard', 'undo' ] },
	                		{ name: 'editing', groups: [ 'find', 'selection', 'spellchecker', 'editing' ] },
	                		{ name: 'links', groups: [ 'links' ] },
	                		{ name: 'insert', groups: [ 'insert' ] },
	                		{ name: 'forms', groups: [ 'forms' ] },
	                		{ name: 'tools', groups: [ 'tools' ] },
	                		{ name: 'document', groups: [ 'mode', 'document', 'doctools' ] },
	                		{ name: 'others', groups: [ 'others' ] },
	                		'/',
	                		{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
	                		{ name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi', 'paragraph' ] },
	                		{ name: 'styles', groups: [ 'styles' ] },
	                		{ name: 'colors', groups: [ 'colors' ] },
	                		{ name: 'about', groups: [ 'about' ] }
	                	];
	
	 

	//隐藏 url上传图片 
 	config.removeButtons = 'Underline,Subscript,Superscript,Link,Unlink,Anchor,Image,Scayt,About';

	// Set the most common block elements.
	config.format_tags = 'p;h1;h2;h3;pre';
	config.language = 'zh-cn'; 
 

	// Simplify the dialog windows.
	config.removeDialogTabs = 'image:advanced;link:advanced';
	config.allowedContent = true ; 
	config.toolbarCanCollapse = true;
	
	//插件  新增本地图片
	config.extraPlugins="linkbutton" ;
};
