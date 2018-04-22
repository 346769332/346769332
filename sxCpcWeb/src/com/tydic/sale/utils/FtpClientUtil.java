package com.tydic.sale.utils;


import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.Vector;





import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPFile;
import org.apache.commons.net.ftp.FTPListParseEngine;
import org.apache.commons.net.ftp.FTPReply;

import com.jcraft.jsch.Channel;
import com.jcraft.jsch.ChannelSftp;
import com.jcraft.jsch.ChannelSftp.LsEntry;
import com.jcraft.jsch.JSch;
import com.jcraft.jsch.JSchException;
import com.jcraft.jsch.Session;
import com.jcraft.jsch.SftpATTRS;
import com.jcraft.jsch.SftpException;
import com.tydic.framework.common.logger.Logger;
import com.tydic.framework.common.logger.LoggerFactory;



/**   
* @Package com.tydic.confMg.util 
* @ClassName FtpClientUtil.java
* @date 2015年10月23日 下午2:58:34 
* @Description: 可通过构造方法来完成不同场景的文件上传下载以及查询
* @version V1.0   
*/
public class FtpClientUtil {

	private static final Logger logger = LoggerFactory.getLogger(FtpClientUtil.class);

	private String host;
	private int port;
	private String username;
	private String password;
	private String fileName;
	private String directory;
	
	private String latnId;

	private ChannelSftp sftp;
	private FTPClient ftp;

	public FtpClientUtil(String host, int port, String username, String password, String fileName, String dictionay,String latnId) {
		this.host = host;
		this.port = port;
		this.username = username;
		this.password = password;
		this.fileName = fileName;
		this.directory = dictionay;
		this.latnId = latnId;
		if (port == 22) {// sftp
			this.sftp = getSftp(host, port, username, password);
		} else {
			this.ftp = getFtp(host, port, username, password);
		}
	}
	public FtpClientUtil(String host, int port, String username, String password, String fileName, String dictionay) {
		this.host = host;
		this.port = port;
		this.username = username;
		this.password = password;
		this.fileName = fileName;
		this.directory = dictionay;
		if (port == 22) {// sftp
			this.sftp = getSftp(host, port, username, password);
		} else {
			this.ftp = getFtp(host, port, username, password);
		}
	}

	public FtpClientUtil(String host, int port, String username, String password, String dictionay) {
		this.host = host;
		this.port = port;
		this.username = username;
		this.password = password;
		this.fileName = "";
		this.directory = dictionay;
		if (port == 22) {// sftp
			this.sftp = getSftp(host, port, username, password);
		} else {
			this.ftp = getFtp(host, port, username, password);
		}
	}

	private ChannelSftp getSftp(String host, int port, String username, String password) {
		ChannelSftp sftp = null;
		try {
			JSch jsch = new JSch();
			jsch.getSession(username, host, port);
			Session sshSession = jsch.getSession(username, host, port);
			logger.info("Session created.");
			sshSession.setTimeout(10000);
			sshSession.setPassword(password);
			Properties sshConfig = new Properties();
			sshConfig.put("StrictHostKeyChecking", "no");
			sshSession.setConfig(sshConfig);
			sshSession.connect();
			logger.info("Session connected.");
			logger.info("Opening Channel.");
			Channel channel = sshSession.openChannel("sftp");
			channel.connect();
			sftp = (ChannelSftp) channel;
			logger.info("Connected to " + host + ".");
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
		return sftp;
	}

	private FTPClient getFtp(String host, int port, String username, String password) {
		FTPClient ftpClient = null;
		try {
			ftpClient = new FTPClient();
			int reply;
			ftpClient.connect(host, port);// 连接FTP服务器
			// 如果采用默认端口，可以使用ftp.connect(url)的方式直接连接FTP服务器
			ftpClient.login(username, password);// 登录
			reply = ftpClient.getReplyCode();
			logger.info(String.valueOf(reply));
			if (!FTPReply.isPositiveCompletion(reply)) {
				ftpClient.disconnect();
			}
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
		return ftpClient;
	}
	// 上传文件
	/**
	 * Description:此处添加方法作用……
	 * @param inputStream  所上传文件流
	 * @return
	 * @throws SftpException 
	 */
	public boolean upload(InputStream inputStream,String filename) {
	    if (inputStream ==  null) {
            return false;
        }
		//String filename = this.fileName;
		if (port == 22) {
			try {
				 
				sftp.cd(directory);
				/*BufferedImage buffer =ImageIO.read(inputStream);
				if(filename.trim().endsWith(".png")){  //将png图片转为gif,解决png图片在页面显示不出来的问题
					ImageOutputStream imOut; 
					ByteArrayOutputStream bs = new ByteArrayOutputStream();  
					imOut = ImageIO.createImageOutputStream(bs); 
					ImageIO.write(buffer, "jpg",imOut); 
					inputStream= new ByteArrayInputStream(bs.toByteArray());
					int dot = filename.lastIndexOf('.'); 
					filename=filename.substring(0, dot);
					filename=filename+".jpg";
				}*/
//				sftp.put(inputStream, filename);
//				logger.info("Upload success.");
				return true;
			} catch (Exception e) {
				logger.error(e.getMessage());
				logger.error("Upload failed...",e);
				     try {
						sftp.mkdir(directory);
						System.out.println("创建目录："+directory);
						sftp.cd(directory);
				        
					} catch (SftpException e1) {
						// TODO Auto-generated catch block
						e1.printStackTrace();
					}
				     return true;
			} finally {
				try {
					sftp.put(inputStream, filename);
					inputStream.close();
					sftp.disconnect();
					sftp.getSession().disconnect();
					sftp.exit();
					logger.info("Disconnected.");
				} catch (Exception e) {
					//e.printStackTrace();
					logger.error("close connection failed...",e);
					//return false;
				}
				
			}
		} else {
			try {
				ftp.changeWorkingDirectory(directory);
				ftp.storeFile(filename, inputStream);
				logger.info("Upload success.");
				return true;
			} catch (Exception e) {
				//e.printStackTrace();
				logger.error("Upload failed...",e);
				return false;
			} finally {
				try {
					inputStream.close();
					ftp.logout();
				} catch (IOException e) {
					logger.error("close connection failed...",e);
					//return false;
				}
			}
		}
	}
	/**
	* 文件删除
	* @param directory 目录
	* @param fileName 要删除的文件名，用逗号分隔
	*/
	public boolean delFiles(String directory, String fileNames) {
		
			if (port == 22) {
				try{
				sftp.cd(directory);
				String[] fileNameArray=fileNames.split(",");
				for (String fileName:fileNameArray) {
					if(!"".equals(fileName)){
						System.out.print("进入删除：+"+fileName);
						sftp.rm(fileName);
						System.out.print("删除成功！");
					}
				}
				}catch (Exception e) {
					logger.error(e.getMessage());
					return false;
				}finally {
					try {
						sftp.disconnect();
						sftp.getSession().disconnect();
						sftp.exit();
						logger.info("Disconnected.");
					} catch (Exception e) {
						//e.printStackTrace();
						logger.error("close connection failed...",e);
						//return false;
					}
					
				}
			}else{
				try {
				//ftp的情况未测
				ftp.changeWorkingDirectory(directory);// 转移到FTP服务器目录
				int i=ftp.dele(fileName);
				} catch (Exception e) {
					logger.error(e.getMessage());
					return false;
				}finally {
					try {
						ftp.logout();
					} catch (IOException e) {
						logger.error("close connection failed...",e);
						//return false;
					}
				}
				//boolean flag=ftp.deleteFile(fileName);
			}
		
		return true;
	}
	/**
	* 单下载文件  根据文件名下载
	* @param directory 下载目录
	* @param downloadFile 下载的文件
	*/
	public Map<String,InputStream> download(String directory, String downloadFile) {
		InputStream is = null;
		Map<String,InputStream> resMap = new HashMap<String,InputStream>();
		try {
			if (port == 22) {
				sftp.cd(directory); 
				/*List files = this.listRemoteAllFiles(directory);
				String name = findDownLoadFile(files,downloadFile);
				is = sftp.get(directory+"/"+name);   //从ftp上获取文件流
				resMap.put(name, is);*/
				is = sftp.get(directory+"/"+downloadFile);   //从ftp上获取文件流
				resMap.put(downloadFile, is);
			}else {
				ftp.changeWorkingDirectory(directory);// 转移到FTP服务器目录
				/*List files = this.listRemoteAllFiles(directory);
				String name = findDownLoadFile(files,downloadFile);
				is = sftp.get(directory+"/"+name);   //从ftp上获取文件流
				resMap.put(name, is);*/
				is = ftp.retrieveFileStream(directory+"/"+downloadFile);   //从ftp上获取文件流
				resMap.put(downloadFile, is);
			}
		} catch (Exception e) {
			logger.error(e.getMessage());
		} 
		return resMap;
	}
	
	/**
	 * 查找是否存在需要下载的文件 
	 * @param files
	 * @param downloadFile
	 * @param type
	 * @param latnId
	 * @return
	 */
	public String findDownLoadFile(List files, String downloadFile) {
		String name = null;
		try {
			for (int i = 0; i < files.size(); i++) {
				Map map = (Map) files.get(i);
				name = (String) map.get("name");
				// 全部转为大写
				String fileName = name.toUpperCase();
				String tempDownloadFile = downloadFile.toUpperCase();
				if (fileName.equals(tempDownloadFile)) {
					return name;
				} else {
					continue;
				}
			}
		} catch (Exception e) {
			logger.error(e.getMessage());
		}

		return null;
	}
	
	//遍历ftp的文件，得到已有文件名
	public List<Map<String,String>> listRemoteAllFiles(String path) {
		List<Map<String,String>> fileList = new ArrayList<Map<String,String>>();
		if(port == 22) {
			try {
				Vector<LsEntry> vector = sftp.ls(path);
				fileList = _buildFiles(vector);
			} catch (Exception e) {
				logger.error(e.getMessage());
			}
		}else {
			try {
				FTPListParseEngine f = ftp.initiateListParsing(path);
				while (f.hasNext()) {
					FTPFile[] files = f.getNext(5);
					for (FTPFile file : files) {
						Map<String,String> map = new HashMap<String,String>();
						map.put("name", new String(file.getName().getBytes("utf-8"),"UTF-8"));
						fileList.add(map);
					}
				}
			} catch (IOException e) {
				logger.error(e.getMessage());
			}
		}
		return fileList;
	}
	
	//sftp 获取文件列表
	private static List<Map<String,String>> _buildFiles(Vector ls) throws Exception {
		if (ls != null && ls.size() >= 0) {
			List<Map<String,String>> list = new ArrayList<Map<String,String>>();
			for (int i = 0; i < ls.size(); i++) {
				LsEntry f = (LsEntry) ls.get(i);
				String nm = f.getFilename();
				if (nm.equals(".") || nm.equals(".."))
					continue;
				SftpATTRS attr = f.getAttrs();
				Map m = new HashMap();
				if (attr.isDir()) {
					m.put("dir", new Boolean(true));
				} else {
					m.put("dir", new Boolean(false));
				}
				m.put("name", nm);
				list.add(m);
			}
			return list;
		}
		return null;
	}

	public void disFile(FTPFile file, String path) {
		if (file.isDirectory() && !file.getName().equals(".") && !file.getName().equals("..")) {
//			System.out.println(File.separator + file.getName());
			listRemoteAllFiles(path + File.separator + file.getName());
		} else if (!file.getName().equals(".") && !file.getName().equals("..")) {
//			System.out.println(file.getName());
		}
	}
	
	//与服务器断开连接
	public void disConnect() {
		if(port == 22) {
			try {
				sftp.disconnect();
				sftp.getSession().disconnect();
				sftp.exit();
			} catch (JSchException e) {
				logger.error(e.getMessage());
			}
			logger.info("Disconnected.");
		}else {
			try {
				ftp.logout();
				ftp.disconnect();
			} catch (IOException e) {
				logger.error(e.getMessage());
			}
			logger.info("close connection");
		}
	}
	

	/**
	 * @param args
	 * @throws IOException 
	 */
	public static void main(String[] args) throws IOException {
		String ip = "133.64.100.4";//192.168.128.101
		int port = 22;
		String username = "tms";//sc_public
		String password = "tMs!#^zH79";//aaBB11..
		String path = "/home/tms/war/csfileupload/1630/";///home/sx_public/test/test
		String filename = "8cb9538053f9716e01fc9e3c86e6f367.png";
		String filePath ="D:\\webdata\\webuser\\upLoadFile\\1060\\106020170912033758660.xlsx";
		String latnId = "563";
		FtpClientUtil client =new FtpClientUtil(ip,port,username,password,filename,path,latnId);
//		File file = new File(filePath);
//		FileInputStream inputStream = null;
//		try {
//			inputStream = new FileInputStream(file);
//		} catch (FileNotFoundException e1) {
//			logger.error(e1.getMessage());
//		}
		//client.upload(inputStream);
		client.delFiles(path, filename);
	}
	
	public String getLatnId() {
		return latnId;
	}

	public void setLatnId(String latnId) {
		this.latnId = latnId;
	}

	public String getHost() {
		return host;
	}

	public void setHost(String host) {
		this.host = host;
	}

	public int getPort() {
		return port;
	}

	public void setPort(int port) {
		this.port = port;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public String getDirectory() {
		return directory;
	}

	public void setDirectory(String directory) {
		this.directory = directory;
	}
}
