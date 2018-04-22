package eee;

import java.util.*;
import java.io.*;

public class FileRecursionPrintDemo {
	public static void main(String[] args) {
		List<String> paths = new ArrayList<String>();
		paths = getAllFilePaths(new File("C:\\Users\\Administrator\\Desktop\\bd_3.2.1_setup"), paths);
		for (String path : paths) {
			System.out.println(path);
		}
	}

	private static List<String> getAllFilePaths(File filePath, List<String> filePaths) {
		File[] files = filePath.listFiles();
		if (files == null) {
			return filePaths;
		}
		for (File f : files) {
			if (f.isDirectory()) {
				filePaths.add(f.getPath());
				getAllFilePaths(f, filePaths);
			} else {
				filePaths.add(f.getPath());
			}
		}
		return filePaths;
	}
}