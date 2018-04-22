<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<title>规范书</title>
		<link href="css/base.css" rel="stylesheet" type="text/css">
		<link href="css/index.css" rel="stylesheet" type="text/css">
		<script type="text/javaScript" src="/CpcWeb/web/js/taskBook/taskBookQry.js"></script>
	</head>

	<body>
		<div class="wyqd" id="taskBookQryPage" >
			<div class="dwqd">
	        	 <dl class="tw_box">
					<dd><a id="bookInfo" class="but" href="#">责任书</a></dt>
	   				<dd><a id="fillBlank" class="but" href="#">责任书填写照片</a></dd>
	   				<dd><a id="signedPhone" class="but" href="#">责任书签订照片</a></dd>
	   				<dd><a id="flowInfo" class="but" href="#">责任书流程信息</a></dd>
	   				<dd><a id="goback" class="but1" href="#" style="float: right;">返回</a></dd>
	             </dl>
	        </div>
	        <div id="bookInfoDiv" style="font-size:12px;">
				<h1>${column1}</h1>
	            <div class="biaoti">
	                <p>${column2}</p>
	                <p>${column3}</p>
	            </div>
	            <!--cbmb_box-->
	            <div  class="cbmb_box">
	                <table width="90%" border="0" cellspacing="0" cellpadding="0" class="table_box" style="border:solid 1px #000;margin:auto;">
	                  <tr>
	                    <td><span class="mb">${column4}</span></td>
	                    <td>${column5}</td>
	                    <td>${column6}</td>
	                    <td>${column7}</td>
	                    <td>${column8}</td>
	                  </tr>
	                  <tr>
	                    <td style="border-top:0px"></td>
	                    <td>${column9}</td>
	                    <td>${column10}</td>
	                    <td>${column11}</td>
	                    <td>${column12}</td>
	                  </tr>
	                </table>
	            </div>
	            <!--cbjl_box-->
	            <div  class="cbjl_box">
	                <table width="90%" border="0" cellspacing="0" cellpadding="0" class="table_box">
	                  <tr>
	                    <td  style="border-top:0px"><span class="jl">${column13}</span></td>
	                    <td  style="border-top:0px;border-right:0px"><span class="xssr">${column14}</span></td>
	                    <td  style="border-top:0px">&nbsp;</td>
	                    <td  style="border-top:0px" class="ts_box">
	                    	<p>${column15}</p>
	                    	<p style="border-right:0px">${column16}</p>
	                    </td>
	                    <td  style="border-top:0px" class="ts_box">
	                        <p>${column17}</p>
	                    	<p style="border-right:0px">${column18}</p>
	                    </td>
	                  </tr>
	                  <!--tr1-->
	                  <tr>
	                    <td style="border-top:0px"></td>
	                    <td>${column19}</td>
	                    <td>${column20}</td>
	                    <td class="ts_box">
	                    	<p>${column21}</p>
	                    	<p style="border-right:0px">${column22}</p>
	                    </td>
	                    <td class="ts_box">
	                        <p>${column23}</p>
	                    	<p style="border-right:0px">${column24}</p>
	                    </td>
	                  </tr>
	                   <tr>
	                    <td style="border-top:0px"></td>
	                    <td>${column25}</td>
	                    <td>${column26}</td>
	                    <td class="ts_box">
	                    	<p>${column27}</p>
	                    	<p style="border-right:0px">${column28}</p>
	                    </td>
	                    <td class="ts_box">
	                        <p>${column29}</p>
	                    	<p style="border-right:0px">${column30}</p>
	                    </td>
	                  </tr>
					<!--tr2-->
	                  <tr>
	                    <td style="border-top:0px"></td>
	                    <td>${column31}</td>
	                    <td>${column32}</td>
	                    <td class="ts_box">
	                    	<p>${column33}</p>
	                    	<p style="border-right:0px">${column34}</p>
	                    </td>
	                    <td class="ts_box">
	                        <p>${column35}</p>
	                    	<p style="border-right:0px">${column36}</p>
	                    </td>
	                  </tr>
	                  <tr>
	                    <td style="border-top:0px"></td>
	                    <td  style="border-right:0px"><span class="hj">${column37}</span></td>
	                    <td  style="border-right:0px">&nbsp;</td>
	                    <td class="ts_box">
	                    	<p>&nbsp;</p>
	                    	<p style="border-right:0px">${column38}</p>
	                    </td>
	                    <td class="ts_box">
	                        <p>${column39}</p>
	                    	<p style="border-right:0px">${column40}</p>
	                    </td>
	                  </tr>
	            	  <!--tr3-->
	                  <tr class="fz">
	                    <td style="border-top:0px"></td>
	                    <td >
	                    	<ul>
	                        	<li class="fz_b">
	                            	<div>${column41}</div>
	                            	<div>&nbsp;</div>
	                            </li>
	                            <li>
	                            	<div style="border-bottom:1px #000 solid;">${column42}</div>
	                            	<div>${column43}</div>
	                            </li>
	                        </ul>
	                    </td>
	                    <td  >
	                    	<ul>
	                        	<li class="fz_b">
	                            	<div style="border-bottom:1px #000 solid;">${column44}</div>
	                            	<div>${column45}</div>
	                            </li>
	                            <li>
	                            	<div style="border-bottom:1px #000 solid;">${column46}</div>
	                            	<div>${column47}</div>
	                            </li>
	                        </ul>
	                    </td>
	                    <td class="ts_box">
	                    	<ul>
	                        	<li class="fz_b">
	                            	<div style="border-bottom:1px #000 solid;">${column48}</div>
	                            	<div>${column49}</div>
	                            </li>
	                            <li>
	                            	<div style="border-bottom:1px #000 solid;">${column50}</div>
	                            	<div>${column51}</div>
	                            </li>
	                        </ul>
	                    </td>
	                    <td class="ts_box">
	                    	<ul>
	                        	<li class="fz_b">
	                            	<div style="border-bottom:1px #000 solid;">${column52}</div>
	                            	<div>${column53}</div>
	                            </li>
	                            <li>
	                            	<div style="border-bottom:1px #000 solid;">${column54}</div>
	                            	<div>${column55}</div>
	                            </li>
	                        </ul>
	                    </td>
	                  </tr> 
	                  
	                  <!--tr4-->               
	                  <tr class="fz">
	                    <td style="border-top:0px"></td>
	                    <td >
	                    	<ul>
	                        	<li class="fz_b">
	                            	<div>${column56}</div>
	                            	<div>&nbsp;</div>
	                            </li>
	                            <li>
	                            	<div style="border-bottom:1px #000 solid;">${column57}</div>
	                            	<div>${column58}</div>
	                            </li>
	                        </ul>
	                    </td>
	                    <td  >
	                    	<ul>
	                        	<li class="fz_b" style="width: 100%">
	                            	<div style="border-bottom:1px #000 solid;">${column59}</div>
	                            	<div>${column60}</div>
	                            </li>
	                        </ul>
	                    </td>
	                    <td class="ts_box">
	                    	<ul>
	                        	<li class="fz_b" style="width: 100%">
	                            	<div style="border-bottom:1px #000 solid;">${column61}</div>
	                            	<div>${column62}</div>
	                            </li>
	                        </ul>
	                    </td>
	                    <td class="ts_box">
	                    	<ul>
	                        	<li class="fz_b" style="width: 100%">
	                            	<div style="border-bottom:1px #000 solid;">${column63}</div>
	                            	<div>${column64}</div>
	                            </li>
	                        </ul>
	                    </td>
	                  </tr>                
	            </table>  
	         </div>
	             <div class="foot">
	                <p>${column65}</p>
	                <p>${column66}</p>
	            </div>
	             <div class="foot_t">
	                <p>${column67}</p>
	                <p>${column68}</p>
	            </div>
	         </div> 
	         
	         <div id="fillBlankDiv">
	          <table width="90%" padding="0" cellspacing="0" cellpadding="0" class="tab5 mt10 lines"  style="margin: 10px auto;">
	             <tr>
	                <td align="left" >填写照片附件</td> 
	             </tr>
	             <tr> 
	               <td  align="left" id="fileInfoDiv"> 
	               </td> 
	             </tr> 
	             </table>    
	        </div>
	        <div id="signedPhoneDiv">
	          <table width="90%" padding="0" cellspacing="0" cellpadding="0" class="tab5 mt10 lines"  style="margin: 10px auto;">
	             <tr>
	                <td align="left" >签订照片附件</td> 
	             </tr>
	             <tr> 
	               <td  align="left" id="signedInfoDiv"> 
	               </td> 
	             </tr> 
	             </table>    
	        </div>
	        
	        <div id="flowInfoDiv">
	           <table width="90%" border="0" cellspacing="0" cellpadding="0" class="tab2 mt10" style="margin: 10px auto;">
					<thead>
						<tr>
						<td>序号</td>
						<td>流程节点</td>
						<td>操作</td>
						<td>处理人</td>
						<td>处理时间</td>
						<td>处理意见</td>
						</tr>
					</thead>
					<tbody id="flowTable">
					</tbody>  
				</table>
	        </div>
	    </div>
    </body>
</html>
