package eee;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class ww {

	public static void main(String[] args) {
		List<String> list=new ArrayList<String>();		
		list.add("a");
		list.add("b");
		list.add("c");
		list.add("d");
		list.add("a");
		list.add("d");
		list.add("b");
		list.add("c");
		list.add("d");
		list.add("a");
		list.add("a");
		list.add("b");
		list.add("c");
		list.add("c");
		list.add("d");
		list.add("d");
		list.add("a");
		list.add("c");
		list.add("c");
		list.add("d");
		list.add("d");
		list.add("c");
		list.add("a");
		list.add("b");
		list.add("c");
		list.add("c");
		list.add("a");
		list.add("d");
		list.add("d");
		list.add("c");
		list.add("a");
		list.add("b");
		list.add("d");
		list.add("b");
		list.add("b");
		list.add("c");
		list.add("c");
		list.add("d");
		list.add("a");
		list.add("b");
		list.add("c");
		list.add("d");
		list.add("a");
		list.add("b");
		list.add("c");
		list.add("d");
		list.add("e");
		list.add("b");
		list.add("a");
		list.add("b");
		list.add("b");
		list.add("b");
		list.add("b");
		list.add("b");
		list.add("d");
		list.add("a");
		list.add("r");
		list.add("b");
		list.add("c");
		list.add("b");//��
		String[] message=new String[4];//�ܹ���Щ�ַ����������
		message[0]="a";		
		message[1]="b";
		message[2]="c";
		message[3]="d";

		int increase=0;
		int rowNum=list.size()/message.length+1;
		//String[][] arrays=new String[message.length][list.size()];
		List<List<String>> contentCsv=new ArrayList<List<String>>(); 
		contentCsv=testlist(message,  list);
		@SuppressWarnings("unused")
		int i333=0;
	}
	public static List<List<String>> testlist(String[] message, List<String> list) {
		List<String> rowList=null;
		List<List<String>> contentCsv=new ArrayList<List<String>>(); 
		int firstFlag=0;//����һ�����ص������±�
		int lastFlag=0;//����һ�����ص������±�
		int i_count=0;
		for (String str : list) {
				if(printArray(message, str)!=-1) {//���str�������������
					if(i_count==0) {
						rowList=new ArrayList<String>();
						rowList.add(str);
						firstFlag=printArray(message, str);
					}else {
						lastFlag=printArray(message, str);
						if(lastFlag>firstFlag) {
							rowList.add(str);
						}else if(lastFlag==firstFlag){
							rowList.set(rowList.size()-1, str);
						}else {
							contentCsv.add(rowList);
							//rowList.clear();
							rowList=new ArrayList<String>();
							rowList.add(str);
						}
						firstFlag=lastFlag;//����ֵ
					}
					i_count++;
				}
				
		}
		
		return contentCsv;
		
	}
	public static boolean useList(String[] arr, String targetValue) {
	    return Arrays.asList(arr).contains(targetValue);
	}
	 public static int printArray(String[] array,String value){  
	        for(int i = 0;i<array.length;i++){  
	            if(array[i].equals(value)){  
	                return i;  
	            }  
	        }  
	        return -1;//��if����������ʱ��Ĭ�Ϸ���һ������ֵ-1  
	    }  
}
