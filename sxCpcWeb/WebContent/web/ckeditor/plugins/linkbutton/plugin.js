(function(){ 
    //Section 1 : 按下自定义按钮时执行的代码 
    var a= { 
        exec:function(editor){ 
            alert("这是自定义按钮"); 
        } 
    }, 
    //Section 2 : 创建自定义按钮、绑定方法 
    b='linkbutton'; 
 
    
     CKEDITOR.plugins.add(b,
    		{
    		    init: function (editor) {
    		        // Add the link and unlink buttons.
    		        editor.addCommand('CodePlugin', new CKEDITOR.dialogCommand('CodePlugin')); //定義dialog，也就是下面的code
    		        editor.ui.addButton('Code',     //定義button的名稱及圖片,以及按下後彈出的dialog
    		        {                               //這裡將button名字取叫'Code'，因此剛剛上方的toolbar也是加入名為Code的按鈕
    		            label: '选择本地图片',
    		            icon:  'plugins/linkbutton/111.png',
    		            command: 'CodePlugin'
    		        });
    		        CKEDITOR.dialog.add('CodePlugin', function (editor) {       
    		        //以下開始定義dialog的屬性及事件           
    		            return {                        //定義簡單的title及寬高
    		                title: '选择本地图片',
    		                minWidth: 400,
    		                minHeight: 300,
    		                contents: [              
    		                    {
    		                        id: 'addPicture',
     		                        elements:              //elements是定義dialog內部的元件，除了下面用到的select跟textarea之外
    		                            [                  //還有像radio或是file之類的可以選擇
    		                             {  type:"html",
    		                            	html:"<input type='file' id=addPicture />" 
    		                            } 
    		                            ]
    		                    }
    		                    ],
    		                onOk: function () {       
    		                	//當按下ok鈕時,將上方定義的元件值取出來，利用insertHtml
      		                    var file = $("input[id=addPicture]").prop('files')[0];
     		                    if(!/image\/\w+/.test(file.type)){ 
     		                    	layer.alert("请确保文件为图像类型",8);
	     		           	       return false;
	     		           	    }
 	     		           	    var reader = new FileReader();
	     		                   reader.readAsDataURL(file);
	     		                   reader.onload = function(evt){
	     		                   	var  fileStr = evt.target.result;
	     		                     var element = CKEDITOR.dom.element.createFromHtml( '<img src='+fileStr+' border="0" title="Hello" />' );
	 	     		                  CKEDITOR.instances.editor1.insertElement( element );
	 	     		                  $("input[id=addPicture]").val('');
 	     		                   };
 	     		                   
     		                } 
    		           };   
    		       }); 
    		    } 
    		});
})(); 