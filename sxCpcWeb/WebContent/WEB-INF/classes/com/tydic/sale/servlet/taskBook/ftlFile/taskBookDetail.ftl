<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<title>综支工作台</title>
		<meta name="description" content=""/>
		<meta name="keywords" content=""/>
		<link href="/CpcWeb/web/css/common.css" rel="stylesheet" type="text/css">
		<link href="/CpcWeb/web/css/jquery.datetimepicker.css" rel="stylesheet" type="text/css">
		<link href="/CpcWeb/web/css/base.css" rel="stylesheet" type="text/css">
		<link href="/CpcWeb/web/css/index.css" rel="stylesheet" type="text/css">
		<script type="text/javascript" src="/CpcWeb/web/js/common/jquery-1.9.1.min.js"></script>
		<script  type="text/javascript" src="/CpcWeb/web/js/common/layer/layer.min.js"></script>
		<script  type="text/javascript" src="/CpcWeb/web/js/common/servlet.url.js"></script>
		<script type="text/javascript" src="/CpcWeb/web/js/common/util.js"></script>
		<script type="text/javascript" src="/CpcWeb/web/js/common/common.js"></script>
		<script type="text/javascript" src="/CpcWeb/web/js/common/jq.ui.js"></script>
		 <script type="text/javascript" src="/CpcWeb/web/js/common/jquery.datetimepicker.js"></script>
		<script type="text/javascript" src="/CpcWeb/web/js/common/orderDealData.js"></script>
		<script type="text/javascript" src="/CpcWeb/web/js/taskBook/taskBookDetail.js"></script>
	</head>

	<body>
		<div id='Layer_Loading' 
					style="position: fixed; left: 48%; top: 40%; width: 110px; height: 75px; padding-top: 35px; margin-left: -55px; margin-top: -37px; text-align: center;  border-radius: 8px; background: #000; opacity: 0.6; filter:alpha(opacity=60); z-index: 99999999; visibility: hidden;" align='absmiddle'>
			<img alt='正在加载...' src='/CpcWeb/web/images/loading.gif'>
		</div>
		<div id="_SysDialogBGDiv" class="backgroudDiv" style="z-index: 99999;">
			<div>
		   		<div></div>
			</div>
		</div>
		<div id='sysRegionDiv'></div>
		<div id='demandInfo_list_main' style="width:99%; margin:0 auto;">
			<div class="left_con" style="width:60%;">
			<div class="list-nav f18 mt10"><span name ="flowName">责任书信息</span></div>
	        <div id="bookInfoDiv" style="font-size:12px;">
				<h1>${column1}</h1>
	            <div class="biaoti">
	                <p>${column2}</p>
	                <p>${column3}</p>
	            </div>
	            <!--cbmb_box-->
	            <div  class="cbmb_box">
	                <table width="99%" border="0" cellspacing="0" cellpadding="0" class="table_box" style="border:solid 1px #000;margin:auto;">
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
	                <table width="99%" border="0" cellspacing="0" cellpadding="0" class="table_box">
	                  <tr>
	                    <td  style="border-top:0px"><span class="jl">${column13}</span></td>
	                    <td  style="border-top:0px;border-right:0px"><span class="xssr">${column14}</span></td>
	                    <td  style="border-top:0px">&nbsp;</td>
	                    <td  style="border-top:0px" class="ts_box">
	                    	<p>${column15}</p>
	                    	<p style="border-right:0px;overflow: hidden;white-space: nowrap;" title="${column16}">${column16}</p>
	                    </td>
	                    <td  style="border-top:0px" class="ts_box">
	                        <p>${column17}</p>
	                    	<p style="border-right:0px; overflow: hidden;white-space: nowrap;" title="${column18}">${column18}</p>
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
	                            	<div style="border-bottom:1px #000 solid;overflow: hidden;white-space: nowrap;" title="${column42}">${column42}</div>
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
	                            	<div style="border-bottom:1px #000 solid;overflow: hidden;white-space: nowrap;" title="${column46}">${column46}</div>
	                            	<div>${column47}</div>
	                            </li>
	                        </ul>
	                    </td>
	                    <td class="ts_box">
	                    	<ul>
	                        	<li class="fz_b">
	                            	<div style="border-bottom:1px #000 solid;overflow: hidden;white-space: nowrap;" title="${column48}">${column48}</div>
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
	             <div class="foot" style="width: 99%;">
	                <p style="width:20%;">${column65}</p>
	                <p style="width:20%;">${column66}</p>
	            </div>
	             <div class="foot_t" style="width: 99%;padding-bottom: 0;">
	                <p style="width:20%;">${column67}</p>
	                <p style="width:20%;">${column68}</p>
	            </div>
	         </div> 
		    <div class="list-nav f18 mt10"><span>处理信息</span></div>
		    <div id="approval" style="display:none;">
		        <table width="100%" border="0" cellspacing="0" cellpadding="0"  class="tab5 mt10 lines" >
		            <tbody>
		                <tr>
		                        <td style="width:100px;text-align:center">审批结论</td>
		                		<td style="width:500px;text-align:left">
		                		     <label><input style="width:10%" name="optRet" type="radio" value="pass" checked>通过</label>
		                		     <label><input style="width:10%" name="optRet" type="radio" value="nopass">不通过</label>
		                		</td>
		                </tr>
		                <tr>
		                     <td style="width:100px;text-align:center">审批意见</td>
		                     <td><textarea  rows="4" id="optDesc" style="width:508px;height:50px;"></textarea  ></td>
		                </tr>
		                <tr><td align="center" colspan="2" style="padding:10px;"><a href="#" class="but" id="submit">提交</a></td></tr>
		            </tbody>
		       	</table>
		    </div>
		    </div>

			<div class="right_con" style="width:38%;margin-top:30px;">
			<table width="100%" border="0" cellspacing="0" cellpadding="0"  class="tab5 mt10 lines f14">
			        <thead>
			            <tr>
			                <th colspan="7">
			                	<span class="fl">流程信息</span>
			                </th>
			            </tr>
			        </thead>
			        <tbody id="recordOfTaskInfo">
			            <tr >
			                <th align="center" style="width: 10%;">序号</th>
			                <th align="center" style="width: 15%;">流程<br>节点</th>
			                <th align="center" style="width: 20%;">操作</th>
			                <th align="center" style="width: 15%;">处理 <br> 人</th>
			                <th align="center" style="width: 20%;">处理<br> 时间</th>
			                <th align="center" style="width: 20%;">处理<br> 意见</th>
			            </tr>
			        </tbody>
			    </table>
			</div>
		</div>
	</body>
</html>
